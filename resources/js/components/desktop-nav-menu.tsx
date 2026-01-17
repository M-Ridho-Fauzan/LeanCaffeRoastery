/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 09/09/2025 - 23:16:07
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 09/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import { Link, usePage } from '@inertiajs/react';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useNavigation } from '@/hooks/use-navigation';
import { isItemActive } from '@/lib/navUtils';
import { cn } from '@/lib/utils';
import { Icon } from './icon';

const activeItemStyles = 'text-primary dark:text-primary-foreground font-semibold';

export function DesktopNavMenu() {
    const { visibleNavItems } = useNavigation();
    const { url } = usePage();

    return (
        <NavigationMenu className="flex h-full items-stretch" viewport={false}>
            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                {visibleNavItems.map((item) => (
                    <NavigationMenuItem key={item.href || item.title} className="relative flex h-full items-center">
                        {item.children && item.children.length > 0 ? (
                            // Item dengan sub-menu (dropdown)
                            <>
                                <NavigationMenuTrigger
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        isItemActive(item, url) && activeItemStyles,
                                        'h-9 cursor-pointer px-3',
                                    )}
                                >
                                    {/* ICON UNTUK MENU UTAMA DI HEADER TIDAK DIGUNAKAN */}
                                    {/* {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />} */}
                                    {item.title}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        {item.children.map((childItem) => (
                                            <li key={childItem.href || childItem.title}>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href={childItem.href}
                                                        className={cn(
                                                            'flex h-full w-full flex-col justify-end rounded-md from-muted/50 to-muted px-4 py-2 no-underline outline-none select-none focus:shadow-md',
                                                            isItemActive(childItem, url) && activeItemStyles,
                                                            'hover:bg-accent hover:text-accent-foreground',
                                                        )}
                                                    >
                                                        <div className="flex items-center text-sm leading-none font-medium">
                                                            {childItem.icon && <Icon iconNode={childItem.icon} className="mr-2 h-4 w-4" />}{' '}
                                                            {childItem.title}
                                                        </div>
                                                        {childItem.description && (
                                                            <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                                {childItem.description}
                                                            </p>
                                                        )}
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </>
                        ) : (
                            <NavigationMenuLink asChild>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        isItemActive(item, url) && activeItemStyles,
                                        'h-9 cursor-pointer bg-transparent px-3 text-[#303182] hover:bg-[#D2D3D5]',
                                    )}
                                >
                                    {/* ICON UNTUK MENU UTAMA DI HEADER TIDAK DIGUNAKAN */}
                                    {/* {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />} */}
                                    {item.title}
                                </Link>
                            </NavigationMenuLink>
                        )}
                        {isItemActive(item, url) && (
                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                        )}
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
