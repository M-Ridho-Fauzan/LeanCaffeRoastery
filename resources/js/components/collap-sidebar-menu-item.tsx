/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 09/09/2025 - 23:09:52
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 09/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
// components/CollapsibleSidebarMenuItem.tsx

import { cn } from '@/lib/utils'; // utilitas untuk menggabungkan classNames
import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react'; // Icon untuk indikator collapse

import { isItemActive } from '@/lib/navUtils'; // Pastikan path ini benar
import { NavItem } from '@/types';

// Anggap komponen ini ada di project Anda (sesuaikan path)
// Anda bisa menggantinya dengan implementasi ShadCN atau custom components
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'; // Contoh dari ShadCN
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from './ui/sidebar';
// Impor komponen Sidebar Anda yang sudah ada

interface CollapsibleSidebarMenuItemProps {
    item: NavItem;
    currentUrl: string;
    level?: number; // Untuk indentasi
}

export default function CollapsibleSidebarMenuItem({ item, currentUrl, level = 0 }: CollapsibleSidebarMenuItemProps) {
    const active = isItemActive(item, currentUrl);
    const hasChildren = item.children && item.children.length > 0;

    // Indentasi berdasarkan level (misal: level 0 -> pl-4, level 1 -> pl-6, level 2 -> pl-8)
    const indent = level * 2; // Setiap level menambahkan 2 unit padding
    const indentClass = `pl-${3 + indent}`; // Base padding 4 + level-based indent

    // Tentukan elemen <li> mana yang akan digunakan berdasarkan level
    // Asumsi: item level 0 pakai <li> biasa (main menu item), level > 0 pakai <li> sub-menu item.
    // Jika Anda ingin semua <li> memiliki data-slot yang sama, cukup gunakan <li> generik.
    const ListItemComponent = level === 0 ? 'li' : 'li'; // Atau bisa jadi ada SidebarMainMenuItem dan SidebarSubMenuItem
    const listItemProps =
        level === 0
            ? { 'data-slot': 'sidebar-menu-item', 'data-sidebar': 'menu-item' }
            : { 'data-slot': 'sidebar-menu-sub-item', 'data-sidebar': 'menu-sub-item' };

    if (hasChildren) {
        // Render sebagai Collapsible jika memiliki anak
        return (
            // Kita akan langsung merender <li> di sini sebagai container
            <ListItemComponent {...listItemProps} className="group/menu-item relative">
                {' '}
                {/* Gunakan className yang sama atau sesuaikan */}
                <Collapsible defaultOpen={active} className="group/collapsible">
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                            isActive={active}
                            className={cn('group flex w-full items-center justify-between', indentClass)}
                            tooltip={{ children: item.title }}
                        >
                            <Link key={item.href || item.title} href={item.href} prefetch={false} className="flex flex-grow items-center space-x-4">
                                {item.icon && <item.icon className="h-4 w-4" />}
                                <span>{item.title}</span>
                            </Link>
                            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                        {/* Menggunakan SidebarMenuSub untuk wrapper <ul> dari sub-menu */}
                        <SidebarMenuSub className="py-1">
                            {item.children!.map((childItem) => (
                                // Rekursif panggil CollapsibleSidebarMenuItem untuk setiap anak
                                // Anak-anak akan secara otomatis merender <li> mereka sendiri
                                <CollapsibleSidebarMenuItem
                                    key={childItem.href || childItem.title}
                                    item={childItem}
                                    currentUrl={currentUrl}
                                    level={level + 1}
                                />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            </ListItemComponent>
        );
    } else {
        // Render sebagai Link biasa jika tidak memiliki anak
        return (
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={active} className={cn(indentClass)} tooltip={{ children: item.title }}>
                    <Link key={item.href || item.title} href={item.href} prefetch={false} className="flex items-center space-x-2">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }
}
