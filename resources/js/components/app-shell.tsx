import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import React from 'react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

// helper untuk membaca cookie
function getCookie(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined; // Untuk Hindari error di SSR
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return undefined;
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    //* get sidebar width from cookie
    const [sidebarWidth, setSidebarWidth] = React.useState<string | undefined>(undefined);

    // Baca cookie di sisi klien setelah mount
    React.useEffect(() => {
        const storedWidth = getCookie('sidebar:width');

        // console.log(storedWidth);

        if (storedWidth) {
            setSidebarWidth(storedWidth);
        }
    }, []);

    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{children}</div>;
    }

    return (
        <SidebarProvider defaultOpen={isOpen} defaultWidth={sidebarWidth}>
            {children}
        </SidebarProvider>
    );
}
