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
import { BookOpen, Building2, Captions, Home, LayoutGrid, MapPinned, Newspaper, ScrollText, ShieldAlert, User } from 'lucide-react';

export const platformItems: LinkItem[] = [
    {
        title: 'Home',
        href: '/',
        icon: Home,
        roles: 'public',
    },
    {
        title: 'About',
        href: '/about',
        icon: Building2,
        roles: 'public',
    },
    {
        title: 'Menu',
        href: '/menu',
        icon: ScrollText,
        roles: 'public',
    },
    {
        title: 'Articles',
        href: '/articles',
        icon: Newspaper,
        roles: 'public',
    },
    {
        title: 'Location',
        href: '/location',
        icon: MapPinned,
        roles: 'public',
    },
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        roles: ['admin', 'author'], // Hanya untuk role 'admin' dan 'author'
    },
];

export const orderingItems: LinkItem[] = [
    {
        title: 'Manage Users',
        href: '/admin/users',
        icon: User,
        roles: ['admin', 'author'], // Hanya untuk role 'admin' dan 'author'
    },
];

export const adminNavItems: LinkItem[] = [
    {
        title: 'Manage Users',
        href: '/admin/users',
        icon: User,
        roles: ['admin', 'author'], // Hanya untuk role 'admin' dan 'author'
    },
];

export const authorNavItems: LinkItem[] = [
    {
        title: 'Manage Blogs',
        href: '/author/posts',
        icon: Captions,
        roles: ['admin', 'author'], // Hanya untuk role 'admin' dan 'author'
    },
];

export const footerNavItems: NavItem[] = [
    {
        title: 'Kebijakan Privasi',
        href: '/kebijakan-privasi',
        icon: ShieldAlert,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];
// Anda bahkan bisa menambahkan data navigasi lain di file ini
// export const userMenuItems: NavItem[] = [ ... ];
