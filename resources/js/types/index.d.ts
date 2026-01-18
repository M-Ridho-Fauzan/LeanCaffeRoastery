import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
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

export type FlashMessages = {
    success?: string;
    error?: string;
    message?: string;
};

/**
 *
 * Penggunaan PageProps: Bagaimana Anda bisa memanfaatkan properti
 * global seperti auth dan flash yang didefinisikan di PageProps.
 *
 */
export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    flash: FlashMessages; // Menambahkan penanganan pesan sukses/error setelah operasi CRUD.
    name: string;
    quote: {
        message: string;
        author: string;
    };
    sidebarOpen: boolean;
    breadcrumbs: BreadcrumbItem[];
};

// ========= Product Interfaces (No Change)

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
    description: string;
    id: number;
    slug: string;
    product_name: string;
    price: number;
    stock: number;
    status: boolean;
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
interface OrderDetail {
    id: string;
    status: 'Waiting' | 'Processing' | 'Completed';
    notificationTitle: string;
    notificationDesc: string;
    notificationTime: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        city: string;
        address: string;
        postalCode: string;
    };
    items: {
        name: string;
        qty: number;
        price: number;
    }[];
    shippingCost: number;
    madeAt: string;
    updatedAt: string;
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

export interface PaginatedResponse<T> {
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

// ==========================================================
// =============== ARTICLE / BLOG INTERFACES ================
// ==========================================================

interface ArticleCategory {
    id: number;
    name: string;
    slug: string;
}

interface ArticleAuthor {
    id: number;
    name: string;
    email: string;
}

interface ArticleTag {
    id: number;
    name: string;
    slug: string;
}

export interface Article {
    content: string;
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image_url: string | null;
    published_at: string | null;
    status: 'draft' | 'published' | 'archived';
    views_count: number;
    created_at: string;
    updated_at: string;
    category: ArticleCategory | null;
    author: ArticleAuthor;
    tags: ArticleTag[];
}

/**
 * Tipe Halaman untuk Index Artikel, menggunakan PaginatedResponse<Article>
 */
export type ArticleIndexPageProps = PageProps<{
    articles: PaginatedResponse<Article>;
}>;

// Payment global props -- can't be fixed, can still be changed

// Asumsi PaymentMethodType sudah didefinisikan sebelumnya, jika belum, tambahkan:
export type PaymentMethodType = 'bank_transfer' | 'virtual_account' | 'e_wallet' | 'qr_code';

// --- Tipe Data untuk VA ---
export interface VaDetails {
    name: string;
    vaNumber: string;
}

export type VA_DATA_TYPE = {
    [key: string]: VaDetails;
};

// --- Interface Dasar untuk Semua Metode Pembayaran ---
// Menggantikan kebutuhan untuk meneruskan semua state dari Checkout.tsx
export interface BasePaymentProps {
    formattedTotalAmount: string;
    totalAmount: number; // Jumlah angka (untuk fungsi copy)
    isProcessingPayment: boolean;
    // Handlers yang dibutuhkan
    handleCopy: (text: string) => void;
    handleGoBackToCheckout: () => void;
    handleFinalizePayment: () => void;
}

// --- Interface Khusus untuk Virtual Account ---
export interface VirtualAccountProps extends BasePaymentProps {
    selectedBank: string | null;
    setSelectedBank: (bankId: string | null) => void;
    showVADetails: boolean;
    setShowVADetails: (show: boolean) => void;
    vaData: VA_DATA_TYPE; // Data yang dibutuhkan untuk merender VA
}

// --- Interface Khusus untuk E-Wallet (mengelola QRIS state) ---
export interface EWalletProps extends BasePaymentProps {
    selectedWallet: string | null;
    setSelectedWallet: (walletId: string | null) => void;
    showQRIS: boolean;
    setShowQRIS: (show: boolean) => void;
}

// --- Interface untuk Dispatcher (payment_method/index.tsx) ---
// Dispatcher perlu tahu metode mana yang aktif dan semua state terkait.
export interface PaymentRendererProps {
    selectedPaymentMethod: string;

    // Core Props
    baseProps: BasePaymentProps;

    // Specific Props
    vaProps: Omit<VirtualAccountProps, keyof BasePaymentProps>;
    eWalletProps: Omit<EWalletProps, keyof BasePaymentProps>;
}
