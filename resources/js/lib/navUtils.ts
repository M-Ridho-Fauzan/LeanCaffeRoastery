/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 10/09/2025 - 00:28:58
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 10/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
// lib/navUtils.ts

import { NavItem } from '@/types'; // Pastikan path ini benar

/**
 * Filters navigation items based on user roles and recursively checks children.
 * If a parent item is accessible, its children are also filtered.
 * If a parent has no accessible children, it might still be shown if it's directly accessible.
 * @param items The array of NavItem to filter.
 * @param userRoles An array of roles the current user possesses.
 * @returns A new array of NavItem containing only accessible items.
 */
export const filterNavItemsByRole = (items: NavItem[], userRoles: string[]): NavItem[] => {
    return items.flatMap((item) => {
        // Check if the user has access to this specific item
        const hasAccess = item.roles === 'public' || (Array.isArray(item.roles) && item.roles.some((role) => userRoles.includes(role)));

        // Recursively filter children, even if the parent itself is not directly accessible
        // because a user might have access to a child even if the parent is not explicitly listed for their role
        let filteredChildren: NavItem[] = [];
        if (item.children && item.children.length > 0) {
            filteredChildren = filterNavItemsByRole(item.children, userRoles);
        }

        // An item is visible if:
        // 1. The user has direct access to it, OR
        // 2. The user has access to any of its children (making the parent a necessary container)
        if (hasAccess || filteredChildren.length > 0) {
            return [{ ...item, children: filteredChildren.length > 0 ? filteredChildren : undefined }];
        }

        return []; // Exclude this item if no direct access and no accessible children
    });
};

/**
 * Recursively checks if a NavItem or any of its children is currently active.
 * @param item The NavItem to check.
 * @param currentUrl The current URL from usePage().url.
 * @returns True if the item or any child is active, false otherwise.
 */
export const isItemActive = (item: NavItem, currentUrl: string): boolean => {
    // Check if the item's own href matches or starts with the current URL
    // Special handling for '/' to avoid false positives for all sub-pages
    const isDirectlyActive = item.href === '/' ? currentUrl === '/' : currentUrl.startsWith(item.href);

    if (isDirectlyActive) {
        return true;
    }

    // Recursively check children
    if (item.children && item.children.length > 0) {
        return item.children.some((child) => isItemActive(child, currentUrl));
    }

    return false;
};
