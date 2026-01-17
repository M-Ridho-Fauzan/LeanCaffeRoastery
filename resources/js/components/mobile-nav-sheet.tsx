/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 09/09/2025 - 23:07:44
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 09/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
// components/MobileNavSheet.tsx

import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useNavigation } from '@/hooks/use-navigation';
import AppLogoIcon from './app-logo-icon';
// import CollapsibleSidebarMenuItem from './CollapsibleSidebarMenuItem';
import { footerNavItems as rightNavItems } from '@/config/navigation';
import CollapsibleSidebarMenuItem from './collap-sidebar-menu-item';
import { Icon } from './icon'; // Asumsi Icon component Anda
import { SidebarProvider } from './ui/sidebar';

export function MobileNavSheet() {
    const { visibleNavItems } = useNavigation();
    const { url } = usePage();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetHeader className="mb-4 flex justify-start text-left">
                    <Link href="/" className="flex items-center space-x-2">
                        <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                        <span className="text-lg font-bold">App Name</span>
                    </Link>
                </SheetHeader>
                <div className="flex h-full flex-1 flex-col space-y-2 overflow-y-auto p-4">
                    {visibleNavItems.map((item) => (
                        // CollapsibleSidebarMenuItem sudah menangani rendering ikon untuk semua level
                        // dan tidak menampilkan deskripsi, jadi tidak perlu perubahan di sini.
                        <SidebarProvider>
                            <CollapsibleSidebarMenuItem key={item.href || item.title} item={item} currentUrl={url} level={0} />
                        </SidebarProvider>
                    ))}

                    {rightNavItems.length > 0 && (
                        <div className="flex flex-col space-y-2 border-t pt-4">
                            {rightNavItems.map((item) => (
                                <a
                                    key={item.title}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 text-sm font-medium"
                                >
                                    {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                    <span>{item.title}</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
