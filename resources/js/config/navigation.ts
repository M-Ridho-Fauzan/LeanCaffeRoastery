/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 09/09/2025 - 22:32:49
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 09/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
// data/navItems.ts

import { NavItem } from '@/types'; // Pastikan path ini benar
import {
    BarChart,
    BookOpen,
    Building2,
    CornerDownRight,
    FileEdit,
    Heart,
    Home,
    LayoutGrid,
    MapPinned,
    Newspaper,
    ScrollText,
    Settings,
    ShieldAlert,
    ShoppingCart,
    User,
} from 'lucide-react';

export const platformItems: NavItem[] = [
    {
        title: 'Home',
        href: '/',
        icon: Home,
        roles: 'public',
        description: 'Go back to the main homepage.', // Contoh deskripsi
    },
    {
        title: 'About',
        href: '/about',
        icon: Building2,
        roles: 'public',
        description: 'Learn more about our company.',
    },
    {
        title: 'Menu',
        href: '/products',
        icon: ScrollText, // Icon ini tetap ada untuk sidebar, tapi di header tidak digunakan untuk menu utama
        roles: 'public',
        description: 'Explore our delicious food and beverage options.', // Deskripsi untuk menu utama
        children: [
            {
                title: 'All Products',
                href: '/products',
                icon: CornerDownRight,
                description: 'Browse all available items in our menu.', // Deskripsi untuk sub-menu
                roles: 'public',
            },
            {
                title: 'Ordering',
                href: '/products/ordering',
                icon: ShoppingCart,
                description: 'Place your order for pickup or delivery.',
                roles: ['user', 'admin', 'author'],
            },
            {
                title: 'Wishlist',
                href: '/products/wishlist',
                icon: Heart,
                description: 'Save your favorite items for later.',
                roles: ['user', 'admin', 'author'],
            },
            {
                title: 'Charts',
                href: '/products/charts',
                icon: BarChart,
                description: 'View sales and product performance charts.',
                roles: ['admin', 'author'],
            },
        ],
    },
    {
        title: 'Articles',
        href: '/articles',
        icon: Newspaper,
        roles: 'public',
        description: 'Read our latest news and blog posts.',
    },
    {
        title: 'Location',
        href: '/location',
        icon: MapPinned,
        roles: 'public',
        description: 'Find our physical store locations and contact info.',
    },
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid, // Icon ini tetap ada untuk sidebar
        roles: ['admin', 'author'],
        description: 'Access your administrative and author tools.', // Deskripsi untuk menu utama
        children: [
            {
                title: 'Overview',
                href: '/dashboard',
                icon: CornerDownRight,
                description: 'See a quick summary of your site activity.',
                roles: ['admin', 'author'],
            },
            {
                title: 'Manage Users',
                href: '/admin/users',
                icon: User,
                description: 'Add, edit, or delete user accounts.',
                roles: ['admin'],
            },
            {
                title: 'Manage Posts',
                href: '/author/posts',
                icon: FileEdit,
                description: 'Create, publish, and manage your articles.',
                roles: ['admin', 'author'],
            },
            {
                title: 'Settings',
                href: '/admin/settings',
                icon: Settings,
                description: 'Configure application settings and preferences.',
                roles: ['admin'],
            },
        ],
    },
];

// orderingItems, adminNavItems, authorNavItems Dihapus dari sini
// Karena sudah digabungkan ke dalam platformItems

export const footerNavItems: NavItem[] = [
    {
        title: 'Kebijakan Privasi',
        href: '/kebijakan-privasi',
        icon: ShieldAlert,
        roles: 'public',
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
        roles: 'public',
    },
];
