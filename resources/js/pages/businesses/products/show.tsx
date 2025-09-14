/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 07/09/2025 - 13:55:04
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 07/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
// resources/js/Pages/products/show.jsx
import ProductDetail from '@/components/product-detail';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import type { ProductResourceWrapper } from '@/types';
import { Head } from '@inertiajs/react';

// Pastikan Anda mengimpor tipe data Product dari index.d.ts
// import { Product } from '@/index.d.ts'; // atau bagaimana pun Anda mengelola tipe global
interface ProductShowProps {
    product: ProductResourceWrapper;
}

function ProductShow({ product: resourceProduct }: ProductShowProps) {
    // product akan otomatis di-type Product jika Anda menggunakan TypeScript
    const actualProduct = resourceProduct.data;
    return (
        <AppHeaderLayout>
            {' '}
            {/* Gunakan layout Anda */}
            <Head title={actualProduct.product_name} />
            <div className="container mx-auto py-8">
                {/* Render komponen yang menampilkan detail produk */}
                <ProductDetail product={actualProduct} />
            </div>
        </AppHeaderLayout>
    );
}

export default ProductShow;
