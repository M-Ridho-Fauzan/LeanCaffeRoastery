/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 18/08/2025 - 15:56:06
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 18/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavMainGroupProps {
    title: string;
    items: NavItem[];
    className?: string;
}

export default function NavMainGroup({ title, items, className = '' }: NavMainGroupProps) {
    const { url } = usePage();

    // Jika tidak ada item, jangan render apa-apa (opsional tapi bagus)
    if (items.length === 0) {
        return null;
    }

    return (
        // 2. Gunakan props yang diterima
        <SidebarGroup className={`px-2 py-0 ${className}`}>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            // 3. Logika `isActive` yang sudah kita perbaiki ada di sini!
                            isActive={item.href === '/' ? url === '/' : url.startsWith(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
