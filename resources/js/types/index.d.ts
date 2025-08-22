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
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface LinkItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    roles: 'public' | string[];
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
};
