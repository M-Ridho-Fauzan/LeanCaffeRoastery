import { NavItem } from '@/types';
import {
    Building2,
    CornerDownRight,
    FileEdit,
    Home,
    LayoutGrid,
    MapPinned,
    Newspaper,
    PackagePlus,
    ScrollText,
    Settings,
    ShieldAlert,
    User,
} from 'lucide-react';

export const platformItems: NavItem[] = [
    {
        title: 'Home',
        href: '/',
        icon: Home,
        roles: 'public',
        description: 'Go back to the main homepage.',
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
        icon: ScrollText,
        roles: 'public',
        description: 'Explore our delicious food and beverage options.',
    },

    {
        title: 'Articles',
        href: '/blog',
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
        icon: LayoutGrid,
        roles: ['admin', 'author'],
        description: 'Access your administrative and author tools.',
        children: [
            {
                title: 'Track Sales',
                href: '/dashboard',
                icon: CornerDownRight,
                description: 'See a quick summary of your site activity.',
                roles: ['admin', 'author'],
            },
            {
                title: 'Order',
                href: '/admin/users',
                icon: User,
                description: 'Add, edit, or delete user accounts.',
                roles: ['admin'],
            },
            {
                title: 'Product',
                href: '/admin/products',
                icon: PackagePlus,
                description: 'Create, publish, and manage your products.',
                roles: ['admin'],
            },
            {
                title: 'Article',
                href: '/editor/articles',
                icon: FileEdit,
                roles: ['admin', 'author'],
                description: 'Manage your articles and review content contributions.',
            },
            {
                title: 'Notification',
                href: '/editor/notifications',
                icon: FileEdit,
                description: 'Create, publish, and manage your articles.',
                roles: ['admin', 'author'],
            },
            {
                title: 'Settings',
                href: '/settings/appearance',
                icon: Settings,
                description: 'Configure application settings and preferences.',
                roles: ['admin'],
            },
        ],
    },
];

export const footerNavItems: NavItem[] = [
    {
        title: 'Kebijakan Privasi',
        href: '/kebijakan-privasi',
        icon: ShieldAlert,
        roles: 'public',
        description: 'Baca kebijakan privasi kami untuk melindungi data Anda.',
    },
];
