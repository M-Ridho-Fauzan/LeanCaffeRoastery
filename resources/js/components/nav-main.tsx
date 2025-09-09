/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 18/08/2025 - 15:54:23
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 18/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import { useNavigation } from '@/hooks/use-navigation'; // Pastikan path ini benar
import { usePage } from '@inertiajs/react';
import CollapsibleSidebarMenuItem from './collap-sidebar-menu-item';
import { SidebarGroup, SidebarMenu } from './ui/sidebar';

export function NavMain() {
    const { visibleNavItems } = useNavigation();
    const { url } = usePage(); // Dapatkan URL saat ini dari usePage

    if (visibleNavItems.length === 0) {
        return null; // Jangan render apa-apa jika tidak ada item yang terlihat
    }

    return (
        // SidebarGroup (opsional): Anda bisa membungkus semua menu dalam satu grup
        // atau langsung merender SidebarMenu
        <SidebarGroup className="px-2 py-0">
            {/* Jika Anda ingin label umum seperti "Main Navigation" */}
            {/* <SidebarGroupLabel>Main Navigation</SidebarGroupLabel> */}
            <SidebarMenu>
                {visibleNavItems.map((item) => (
                    <CollapsibleSidebarMenuItem
                        key={item.href || item.title} // Key unik untuk setiap item
                        item={item}
                        currentUrl={url} // Teruskan URL saat ini ke komponen anak
                    />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
