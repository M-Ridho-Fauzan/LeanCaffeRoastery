import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, ShoppingBag, User as UserIcon } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    // --- LOGIKA CEK ROLE ---
    // Sesuaikan 'admin' di bawah ini dengan value role di database Anda.
    // Contoh lain: user.is_admin, user.role_id === 1, dll.
    const isAdmin = user.role === 'admin';

    return (
        <>
            {/* Nama & Email tetap ditampilkan agar user tahu akun siapa yang sedang login */}
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* --- MENU KHUSUS USER BIASA (Bukan Admin) --- */}
            {!isAdmin && (
                <>
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                                <UserIcon className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            {/* Pastikan mengganti route ini ke halaman order yang benar nanti */}
                            <Link className="block w-full" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                My Order
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                </>
            )}

            {/* --- MENU UMUM (Muncul untuk Admin & User) --- */}
            <DropdownMenuItem asChild>
                <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
