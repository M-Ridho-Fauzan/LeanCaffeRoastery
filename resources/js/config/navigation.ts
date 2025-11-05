import { NavItem } from '@/types';
import {
    BarChart,
    Building2,
    CornerDownRight,
    FileEdit,
    FilePlus2,
    Heart,
    Home,
    LayoutGrid,
    MapPinned,
    Newspaper,
    PackagePlus,
    ScrollText,
    Settings,
    Shapes,
    ShieldAlert,
    Tag,
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
        children: [
            {
                title: 'All Products',
                href: '/products',
                icon: CornerDownRight,
                description: 'Browse all available items in our menu.',
                roles: 'public',
            },
            // {
            //     title: 'Ordering',
            //     href: '/product/ordering',
            //     icon: ShoppingCart,
            //     description: 'Place your order for pickup or delivery.',
            //     roles: ['user', 'admin', 'author'],
            // },
            {
                title: 'Wishlist',
                href: '/products/wishlist',
                icon: Heart,
                description: 'Save your favorite items for later.',
                roles: ['user', 'admin', 'author'],
            },
            {
                title: 'Charts',
                href: '/product/charts',
                icon: BarChart,
                description: 'View sales and product performance charts.',
                roles: ['admin', 'author'],
            },
        ],
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
                title: 'Overview',
                href: '/dashboard',
                icon: CornerDownRight,
                description: 'See a quick summary of your site activity.',
                roles: ['admin', 'author'],
            },
            {
                title: 'Charts', // Pindahkan ke sini untuk analisis admin/author
                href: '/dashboard/charts',
                icon: BarChart,
                description: 'View sales and product performance charts.',
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
                title: 'Manage Products', // Plural dan deskripsi sesuai
                href: '/admin/products',
                icon: PackagePlus,
                description: 'Create, publish, and manage your products.',
                roles: ['admin'],
            },
            {
                title: 'Articles & Content', // Menggabungkan semua hal terkait artikel di sini
                icon: FileEdit,
                roles: ['admin', 'author'],
                description: 'Manage your articles and review content contributions.',
                children: [
                    {
                        title: 'All Articles', // Untuk admin melihat semua, atau author melihat semua miliknya
                        href: '/editor/articles',
                        icon: Newspaper,
                        description: 'View and manage all published and draft articles.',
                        roles: ['admin'], // Admin bisa melihat semua
                    },
                    {
                        title: 'My Articles', // Untuk author hanya melihat artikelnya sendiri
                        href: '/editor/articles/my',
                        icon: CornerDownRight,
                        description: 'View and manage articles you have created.',
                        roles: ['admin', 'author'], // Author hanya melihat miliknya, Admin juga bisa lihat miliknya
                    },
                    {
                        title: 'Add Article',
                        href: route('editor.articles.create'),
                        icon: FilePlus2,
                        description: 'Create and publish a new article.',
                        roles: ['admin', 'author'],
                    },
                ],
            },
            {
                title: 'Content Structure', // untuk manajemen Admin-Only
                icon: Shapes,
                roles: ['admin'],
                description: 'Admin-only tools to organize categories and tags for articles.',
                children: [
                    {
                        title: 'Manage Categories',
                        href: '/editor/categories',
                        icon: Shapes, // atau ikon berbeda jika ada
                        description: 'Add, edit, and organize article categories system-wide.',
                        roles: ['admin'],
                    },
                    {
                        title: 'Manage Tags',
                        href: '/editor/tags',
                        icon: Tag,
                        description: 'Add, edit, and manage article tags system-wide.',
                        roles: ['admin'],
                    },
                ],
            },
            {
                title: 'Advanced Settings',
                href: '/admin/settings',
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
