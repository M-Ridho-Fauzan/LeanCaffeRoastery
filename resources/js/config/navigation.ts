/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 20/08/2025 - 17:46:52
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 20/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import { LinkItem, NavItem } from '@/types';
import { BookOpen, Captions, Folder, Home, LayoutGrid, User } from 'lucide-react';

export const platformItems: NavItem[] = [
    {
        title: 'Home',
        href: '/',
        icon: Home,
        roles: 'public',
    },
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        roles: ['admin', 'author'], // Hanya untuk role 'admin' dan 'author'
    },
];

export const adminNavItems: NavItem[] = [
    {
        title: 'Manage Users',
        href: '/admin/users',
        icon: User,
        roles: ['admin', 'author'], // Hanya untuk role 'admin' dan 'author'
    },
];

export const authorNavItems: NavItem[] = [
    {
        title: 'Manage Blogs',
        href: '/author/blogs',
        icon: Captions,
        roles: ['admin', 'author'], // Hanya untuk role 'admin' dan 'author'
    },
];

export const footerNavItems: LinkItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];
// Anda bahkan bisa menambahkan data navigasi lain di file ini
// export const userMenuItems: NavItem[] = [ ... ];
