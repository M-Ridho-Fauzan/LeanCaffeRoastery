// use-sidebar-resize.tsx

import React from 'react';

export interface UseSidebarResizeProps {
    /**
     * Direction of the resize handle
     * - 'left': Handle is on left side (for right-positioned panels)
     * - 'right': Handle is on right side (for left-positioned panels)
     */
    direction?: 'left' | 'right';

    /**
     * Current width of the panel
     */
    currentWidth: string;

    /**
     * Callback to update width when resizing
     */
    onResize: (width: string) => void;

    /**
     * Callback to toggle panel visibility
     */
    onToggle?: () => void;

    /**
     * Whether the panel is currently collapsed
     */
    isCollapsed?: boolean;

    /**
     * Minimum resize width
     */
    minResizeWidth?: string;

    /**
     * Maximum resize width
     */
    maxResizeWidth?: string;

    /**
     * Whether to enable auto-collapse when dragged below threshold
     */
    enableAutoCollapse?: boolean;

    /**
     * Auto-collapse threshold as percentage of minResizeWidth
     * A value of 1.0 means the panel will collapse when dragged to minResizeWidth
     * A value of 0.5 means the panel will collapse when dragged to 50% of minResizeWidth
     * A value of 1.5 means the panel will collapse when dragged to 50% beyond minResizeWidth
     * Can be any positive number, not limited to the range 0.0-1.0
     */
    autoCollapseThreshold?: number;

    /**
     * Threshold to expand when dragging in opposite direction (0.0-1.0)
     * Percentage of distance needed to drag back to expand
     */
    expandThreshold?: number;

    /**
     * Whether to enable drag functionality
     */
    enableDrag?: boolean;

    /**
     * Callback to update dragging rail state
     */
    setIsDraggingRail?: (isDragging: boolean) => void;

    /**
     * Cookie name for persisting width
     */
    widthCookieName?: string;

    /**
     * Cookie max age in seconds
     */
    widthCookieMaxAge?: number;

    /**
     * Whether this is a nested sidebar (not at the edge of the screen)
     */
    isNested?: boolean;

    /**
     * Whether to enable toggle functionality
     */
    enableToggle?: boolean;
}

interface WidthUnit {
    value: number;
    unit: 'rem' | 'px';
}

/**
 * Parse width string into value and unit
 */
function parseWidth(width: string): WidthUnit {
    const unit = width.endsWith('rem') ? 'rem' : 'px';
    const value = Number.parseFloat(width);
    return { value, unit };
}

/**
 * Convert any width to pixels for calculations
 */
function toPx(width: string): number {
    const { value, unit } = parseWidth(width);
    // Assuming 1rem = 16px for calculations if not explicitly provided by CSS root font size
    return unit === 'rem' ? value * 16 : value;
}

/**
 * Format width value with unit
 */
function formatWidth(value: number, unit: 'rem' | 'px'): string {
    return `${unit === 'rem' ? value.toFixed(1) : Math.round(value)}${unit}`;
}

/**
 * A versatile hook for handling resizable sidebar (or inset) panels
 * Works for both sidebar (left side) and artifacts (right side) panels
 * Supports VS Code-like continuous drag to collapse/expand
 */
export function useSidebarResize({
    direction = 'right',
    currentWidth,
    onResize,
    onToggle,
    isCollapsed = false,
    minResizeWidth = '14rem',
    maxResizeWidth = '24rem',
    enableToggle = true,
    enableAutoCollapse = true,
    autoCollapseThreshold = 1.5, // Default to collapsing at minWidth + 50%
    expandThreshold = 0.2,
    enableDrag = true,
    setIsDraggingRail = () => {},
    widthCookieName,
    widthCookieMaxAge = 60 * 60 * 24 * 7, // 1 week default
    isNested = false,
}: UseSidebarResizeProps) {
    // Refs for tracking drag state
    const dragRef = React.useRef<HTMLButtonElement>(null);
    const startWidth = React.useRef(0);
    const startX = React.useRef(0); // Unified initial clientX for mouse/touch
    const isDragging = React.useRef(false);
    const isInteractingWithRail = React.useRef(false);
    const lastDragDirection = React.useRef<'expand' | 'collapse' | null>(null);
    const lastTogglePoint = React.useRef(0);
    const lastToggleWidth = React.useRef(0);
    const toggleCooldown = React.useRef(false);
    const lastToggleTime = React.useRef(0);
    const dragDistanceFromToggle = React.useRef(0);
    const railRect = React.useRef<DOMRect | null>(null);

    // Memoize min/max width calculations for performance
    const minWidthPx = React.useMemo(() => toPx(minResizeWidth), [minResizeWidth]);
    const maxWidthPx = React.useMemo(() => toPx(maxResizeWidth), [maxResizeWidth]);

    // Helper to get clientX from MouseEvent or TouchEvent
    const getClientX = React.useCallback((event: MouseEvent | TouchEvent) => {
        if (event instanceof MouseEvent) {
            return event.clientX;
        } else if ('touches' in event && event.touches.length > 0) {
            return event.touches[0].clientX;
        }
        return 0;
    }, []);

    // Helper function to determine if width is increasing based on direction and mouse movement
    const isIncreasingWidth = React.useCallback(
        (currentX: number, referenceX: number): boolean => {
            return direction === 'left'
                ? currentX < referenceX // For left-positioned handle, moving left increases width
                : currentX > referenceX; // For right-positioned handle, moving right increases width
        },
        [direction],
    );

    // Helper function to calculate width based on mouse position and direction
    const calculateWidth = React.useCallback(
        (clientX: number, initialX: number, initialWidth: number, currentRailRect: DOMRect | null): number => {
            if (isNested && currentRailRect) {
                // For nested sidebars, use the delta from start position for precise tracking
                const deltaX = clientX - initialX;

                if (direction === 'left') {
                    // For left-positioned handle (right panel)
                    // Width increases as mouse moves left (negative deltaX)
                    return initialWidth - deltaX;
                }
                // For right-positioned handle (left panel)
                // Width increases as mouse moves right (positive deltaX)
                return initialWidth + deltaX;
            }
            // For standard sidebars at window edges
            if (direction === 'left') {
                // For left-positioned handle (right panel)
                return window.innerWidth - clientX;
            }
            // For right-positioned handle (left panel)
            return clientX;
        },
        [direction, isNested],
    );

    // Persist width to cookie if cookie name is provided
    const persistWidth = React.useCallback(
        (width: string) => {
            if (widthCookieName) {
                document.cookie = `${widthCookieName}=${width}; path=/; max-age=${widthCookieMaxAge}`;
            }
        },
        [widthCookieName, widthCookieMaxAge],
    );

    // Unified start interaction handler for both mouse and touch
    const startInteraction = React.useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (!enableDrag) {
                return;
            }

            if (e.cancelable) {
                e.preventDefault(); // Moved here, and conditionally called
            }

            isInteractingWithRail.current = true;
            isDragging.current = false; // Reset dragging flag on new interaction

            const clientX = getClientX(e);
            if (clientX === 0) return; // Guard against events without clientX

            // Store initial state
            const currentWidthPx = isCollapsed ? 0 : toPx(currentWidth);
            startWidth.current = currentWidthPx;
            startX.current = clientX; // Use the unified clientX
            lastTogglePoint.current = clientX;
            lastToggleWidth.current = currentWidthPx;
            lastDragDirection.current = null;
            toggleCooldown.current = false;
            lastToggleTime.current = 0;
            dragDistanceFromToggle.current = 0;

            // Store the rail element's position for nested sidebars
            if (isNested && dragRef.current) {
                railRect.current = dragRef.current.getBoundingClientRect();
            } else {
                railRect.current = null;
            }

            // e.preventDefault(); // Prevent default touch behavior like scrolling
        },
        [enableDrag, isCollapsed, currentWidth, isNested, getClientX],
    );

    // Unified drag handler for both mouse and touch
    const handleDrag = React.useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (!isInteractingWithRail.current) return;

            const clientX = getClientX(e);
            if (clientX === 0) return;

            const deltaX = Math.abs(clientX - startX.current);
            if (!isDragging.current && deltaX > 5) {
                // Threshold for starting drag
                isDragging.current = true;
                setIsDraggingRail(true);
            }

            if (isDragging.current) {
                // Crucial: Prevent default scrolling for touchmove events during drag
                // Also check e.cancelable before calling preventDefault
                if (e.cancelable) {
                    e.preventDefault();
                }

                // Get unit for width calculations
                const { unit } = parseWidth(currentWidth);

                // Get current rail position for ultra-precise tracking
                let currentRailRect = railRect.current;
                if (isNested && dragRef.current) {
                    currentRailRect = dragRef.current.getBoundingClientRect();
                }

                // Determine current drag direction
                const currentDragDirection = isIncreasingWidth(clientX, lastTogglePoint.current) ? 'expand' : 'collapse';

                // Update direction tracking
                if (lastDragDirection.current !== currentDragDirection) {
                    lastDragDirection.current = currentDragDirection;
                }

                // Calculate distance from last toggle point
                dragDistanceFromToggle.current = Math.abs(clientX - lastTogglePoint.current);

                // Check for toggle cooldown (prevent rapid toggling)
                const now = Date.now();
                if (toggleCooldown.current && now - lastToggleTime.current > 200) {
                    toggleCooldown.current = false;
                }

                // Handle toggling between collapsed and expanded states
                if (!toggleCooldown.current) {
                    // Handle collapsing when expanded
                    if (enableAutoCollapse && onToggle && !isCollapsed) {
                        // Calculate precise width based on mouse position
                        const currentDragWidth = calculateWidth(clientX, startX.current, startWidth.current, currentRailRect);

                        // Determine if we should collapse based on threshold
                        let shouldCollapse = false;

                        if (autoCollapseThreshold <= 1.0) {
                            // For thresholds <= 1.0, collapse when width is below minWidth * threshold
                            shouldCollapse = currentDragWidth <= minWidthPx * autoCollapseThreshold;
                        } else {
                            // For thresholds > 1.0, we need to drag beyond minWidth by a certain amount
                            if (currentDragWidth <= minWidthPx) {
                                // Calculate how much beyond minWidth we need to drag
                                const extraDragNeeded = minWidthPx * (autoCollapseThreshold - 1.0);

                                // Only collapse if we've dragged far enough beyond minWidth
                                const distanceBeyondMin = minWidthPx - currentDragWidth;

                                shouldCollapse = distanceBeyondMin >= extraDragNeeded;
                            }
                        }

                        if (currentDragDirection === 'collapse' && shouldCollapse) {
                            onToggle(); // Collapse
                            lastTogglePoint.current = clientX;
                            lastToggleWidth.current = 0; // Width is 0 when collapsed
                            toggleCooldown.current = true;
                            lastToggleTime.current = now;
                            e.preventDefault(); // Prevent further drag after toggling
                            return;
                        }
                    }

                    // Handle expanding when collapsed
                    if (
                        onToggle &&
                        isCollapsed &&
                        currentDragDirection === 'expand' &&
                        dragDistanceFromToggle.current > minWidthPx * expandThreshold
                    ) {
                        onToggle(); // Expand

                        // Calculate initial width based on exact mouse position
                        const initialWidth = calculateWidth(clientX, startX.current, startWidth.current, currentRailRect);

                        // Clamp to min/max
                        const clampedWidth = Math.max(minWidthPx, Math.min(maxWidthPx, initialWidth));

                        // Set initial width when expanding
                        const formattedWidth = formatWidth(unit === 'rem' ? clampedWidth / 16 : clampedWidth, unit);
                        onResize(formattedWidth);
                        persistWidth(formattedWidth);

                        lastTogglePoint.current = clientX;
                        lastToggleWidth.current = clampedWidth;
                        toggleCooldown.current = true;
                        lastToggleTime.current = now;
                        e.preventDefault(); // Prevent further drag after toggling
                        return;
                    }
                }

                // Skip width calculations if panel is collapsed
                if (isCollapsed) {
                    return;
                }

                // Calculate new width based on mouse position and drag direction
                const newWidthPx = calculateWidth(clientX, startX.current, startWidth.current, currentRailRect);

                // Clamp width between min and max
                const clampedWidthPx = Math.max(minWidthPx, Math.min(maxWidthPx, newWidthPx));

                // Convert to the target unit
                const newWidth = unit === 'rem' ? clampedWidthPx / 16 : clampedWidthPx;

                // Format and update width
                const formattedWidth = formatWidth(newWidth, unit);
                onResize(formattedWidth);
                persistWidth(formattedWidth);

                e.preventDefault(); // Prevent text selection during drag, crucial for touch
            }
        },
        [
            onResize,
            onToggle,
            isCollapsed,
            currentWidth,
            persistWidth,
            setIsDraggingRail,
            minWidthPx,
            maxWidthPx,
            isIncreasingWidth,
            calculateWidth,
            isNested,
            enableAutoCollapse,
            autoCollapseThreshold,
            expandThreshold,
            getClientX,
        ],
    );

    // Unified end interaction handler for both mouse and touch
    const endInteraction = React.useCallback(() => {
        if (!isInteractingWithRail.current) return;

        // Handle click (not drag) behavior if no drag occurred
        if (!isDragging.current && onToggle && enableToggle) {
            onToggle();
        }

        // Reset all state
        isDragging.current = false;
        isInteractingWithRail.current = false;
        lastDragDirection.current = null;
        lastTogglePoint.current = 0;
        lastToggleWidth.current = 0;
        toggleCooldown.current = false;
        lastToggleTime.current = 0;
        dragDistanceFromToggle.current = 0;
        railRect.current = null;
        setIsDraggingRail(false);
    }, [onToggle, enableToggle, setIsDraggingRail]);

    React.useEffect(() => {
        const dragElement = dragRef.current;

        // Native touchstart handler on the element itself, with passive: false
        // This makes sure the touchstart event is cancelable when it originates from the dragRef button.
        const nativeTouchStart = (e: TouchEvent) => {
            // No explicit preventDefault here, as startInteraction will handle it conditionally.
            startInteraction(e);
        };

        const unifiedHandleDrag = (e: MouseEvent | TouchEvent) => handleDrag(e);
        const unifiedEndInteraction = () => endInteraction();

        if (dragElement) {
            dragElement.addEventListener('touchstart', nativeTouchStart, { passive: false });
        }

        document.addEventListener('mousemove', unifiedHandleDrag);
        document.addEventListener('mouseup', unifiedEndInteraction);
        document.addEventListener('touchmove', unifiedHandleDrag, { passive: false });
        document.addEventListener('touchend', unifiedEndInteraction);

        return () => {
            if (dragElement) {
                dragElement.removeEventListener('touchstart', nativeTouchStart);
            }
            document.removeEventListener('mousemove', unifiedHandleDrag);
            document.removeEventListener('mouseup', unifiedEndInteraction);
            document.removeEventListener('touchmove', unifiedHandleDrag);
            document.removeEventListener('touchend', unifiedEndInteraction);
        };
    }, [handleDrag, endInteraction, startInteraction]);

    // Handlers to be passed to the button's onMouseDown/onTouchStart
    const handleMouseDown = React.useCallback(
        (e: React.MouseEvent) => {
            startInteraction(e.nativeEvent);
        },
        [startInteraction],
    );

    // handleTouchStart is no longer needed here as the native touchstart listener handles it.
    // We can return a no-op function or remove it from the exposed interface if not strictly required elsewhere.
    // For consistency if the interface expects it, we can return a dummy.
    const handleTouchStart = React.useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (e: React.TouchEvent) => {
            // This function won't actually be called if `nativeTouchStart` is correctly setup
            // and `onTouchStart` is removed from SidebarRail.
            // If you MUST use it on the component, you'd call startInteraction(e.nativeEvent) here,
            // but then you'd be fighting React's default passive behavior for touch events.
            // It's safer to let the native listener handle it.
            // console.warn('handleTouchStart was called, but native listener is preferred for touch events.');
        },
        [], // No dependencies as it's a dummy function
    );

    return {
        dragRef,
        isDragging,
        handleMouseDown,
        handleTouchStart, // Still expose it if your SidebarRail expects it, but it won't be functional for passive:false
    };
}
