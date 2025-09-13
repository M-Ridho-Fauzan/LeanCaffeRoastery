/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 18/08/2025 - 15:49:34
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 18/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    url?: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href?: string;
    description?: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles: 'public' | string[];
    children?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    // avatar?: string;
    avatar_path: string | null;
    avatar_url: string;
    can_be_admin: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: 'user' | 'author' | 'admin';
    [key: string]: unknown; // This allows for additional properties...
}

// ===

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    flash: FlashMessages;
    name: string;
    quote: {
        message: string;
        author: string;
    };
    sidebarOpen: boolean;
    breadcrumbs: BreadcrumbItem[];
};

// ========= Menu Interfaces

interface BrewMethod {
    id: number;
    brew_name: string;
    description?: string; // Tambahkan deskripsi jika ada
}
interface Origin {
    id: number;
    origin_name: string;
    country?: string;
    region?: string;
}
interface Process {
    id: number;
    process_name: string;
    description?: string; // Tambahkan deskripsi jika ada
}

interface ProductImage {
    id: number;
    url: string;
    alt_text: string | null;
    is_primary: boolean;
}

interface Product {
    id: number;
    slug: string;
    product_name: string;
    price: number;
    flavor_notes: string;
    type: string;
    is_specialty: boolean;
    primary_image_url: string | null;
    origins: Origin[];
    processes: Process[];
    brew_methods: BrewMethod[];
    images?: ProductImage[];
}

interface ProductResourceWrapper {
    data: Product;
}

interface PaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
}

interface PaginatedResponse<T> {
    data: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
}

interface FilterOptions {
    brewMethods: BrewMethod[];
    origins: Origin[];
    processes: Process[];
    types: string[];
}

interface ActiveFilters {
    type: string;
    origin_id: string;
    process_id: string;
    brew_method_id: string;
}

interface ZiggyProps {
    query?: { [key: string]: string | string[] };
}
