/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 09/09/2025 - 23:19:34
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 09/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
// components/HeaderActions.tsx

import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, Search } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content'; // Sesuaikan path
import { Icon } from './icon'; // Sesuaikan path

import { footerNavItems as rightNavItems } from '@/config/navigation'; // Ini adalah item statis Anda
import { useInitials } from '@/hooks/use-initials'; // Sesuaikan path
import { SharedData } from '@/types'; // Sesuaikan path

// interface HeaderActionsProps {
//     // Mungkin tidak perlu props khusus
// }

export function HeaderActions() {
    // {}: HeaderActionsProps
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const user = auth.user;
    const getInitials = useInitials();

    return (
        <div className="ml-auto flex items-center space-x-2">
            <div className="relative flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer">
                    <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                </Button>
                <div className="hidden lg:flex">
                    {rightNavItems.map((item) => (
                        <TooltipProvider key={item.title} delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <span className="sr-only">{item.title}</span>
                                        {item.icon && <Icon iconNode={item.icon} className="size-5 opacity-80 group-hover:opacity-100" />}
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{item.title}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </div>
            </div>

            {/* Tampilkan menu user atau tombol login/register */}
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-auto items-center gap-x-2 rounded-full p-1 pr-2">
                            <Avatar className="size-8 overflow-hidden rounded-full">
                                <AvatarImage src={user.avatar_url} alt={user.name} />
                                <AvatarFallback className="rounded-full bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <UserMenuContent user={user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <div className="flex items-center space-x-1">
                    <Link href={route('login')}>
                        <Button variant="ghost">Log in</Button>
                    </Link>
                    <Link href={route('register')}>
                        <Button>Register</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
