/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 13/09/2025 - 16:52:39
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 13/09/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import AppHeaderLayout from '@/layouts/app/app-header-layout';

export default function LandingPage() {
    // Dummy data for coffee products
    const coffeeProducts = [
        {
            id: 1,
            name: 'THE SAGARA 1999',
            type: 'ESPRESSO ROAST 100% ARABICA',
            badge: 'Best Seller',
            blend: 'House Blend',
            description: 'Our flagship blend with rich chocolate and caramel notes.',
            origin: 'Brazil & Colombia',
            roast: 'Medium',
            price: 'Rp. 120.000',
        },
        {
            id: 2,
            name: 'THE SAGARA 1999',
            type: 'ESPRESSO ROAST 100% ARABICA',
            badge: 'Best Seller',
            blend: 'House Blend',
            description: 'Our flagship blend with rich chocolate and caramel notes.',
            origin: 'Brazil & Colombia',
            roast: 'Medium',
            price: 'Rp. 120.000',
        },
        {
            id: 3,
            name: 'THE SAGARA 1999',
            type: 'ESPRESSO ROAST 100% ARABICA',
            badge: 'Best Seller',
            blend: 'House Blend',
            description: 'Our flagship blend with rich chocolate and caramel notes.',
            origin: 'Brazil & Colombia',
            roast: 'Medium',
            price: 'Rp. 120.000',
        },
        {
            id: 4,
            name: 'THE SAGARA 1999',
            type: 'ESPRESSO ROAST 100% ARABICA',
            badge: 'Best Seller',
            blend: 'House Blend',
            description: 'Our flagship blend with rich chocolate and caramel notes.',
            origin: 'Brazil & Colombia',
            roast: 'Medium',
            price: 'Rp. 120.000',
        },
        {
            id: 5,
            name: 'THE SAGARA 1999',
            type: 'ESPRESSO ROAST 100% ARABICA',
            badge: 'Best Seller',
            blend: 'House Blend',
            description: 'Our flagship blend with rich chocolate and caramel notes.',
            origin: 'Brazil & Colombia',
            roast: 'Medium',
            price: 'Rp. 120.000',
        },
        {
            id: 6,
            name: 'THE SAGARA 1999',
            type: 'ESPRESSO ROAST 100% ARABICA',
            badge: 'Best Seller',
            blend: 'House Blend',
            description: 'Our flagship blend with rich chocolate and caramel notes.',
            origin: 'Brazil & Colombia',
            roast: 'Medium',
            price: 'Rp. 120.000',
        },
    ];

    return (
        <AppHeaderLayout>
            {/* Main Content Area */}
            <div className="relative">
                {/* Background Image/Overlay (simulating the image header) */}
                <div
                    className="relative h-80 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(https://placehold.co/1200x320/000000/FFFFFF?text=Coffee+Beans+Background)` }}
                >
                    <div className="absolute inset-0 bg-black opacity-60"></div> {/* Dark overlay */}
                    <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white">
                        <h1 className="mb-4 text-4xl font-bold md:text-5xl">Our Coffee Menu</h1>
                        <p className="max-w-2xl text-lg md:text-xl">
                            Discover our carefully curated selection of premium coffees from around the world.
                        </p>
                        {/* Search Bar */}
                        <div className="mt-8 w-full max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search coffee..."
                                    className="bg-opacity-90 w-full rounded-full bg-white py-3 pr-4 pl-12 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    {/* Search icon (SVG for simplicity) */}
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Buttons Section */}
                <section className="bg-gray-100 px-4 py-6">
                    <div className="container mx-auto flex flex-wrap justify-center gap-4">
                        <button className="rounded-full bg-indigo-600 px-6 py-2 font-semibold text-white shadow-md transition-colors duration-200">
                            All
                        </button>
                        <button className="rounded-full bg-white px-6 py-2 font-semibold text-gray-700 shadow-md transition-colors duration-200 hover:bg-gray-100">
                            Filter Series
                        </button>
                        <button className="rounded-full bg-white px-6 py-2 font-semibold text-gray-700 shadow-md transition-colors duration-200 hover:bg-gray-100">
                            Espresso Based
                        </button>
                    </div>
                </section>

                {/* Coffee Product Grid */}
                <section className="bg-white px-4 py-12">
                    <div className="container mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                        {coffeeProducts.map((product) => (
                            <div key={product.id} className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                                {/* "Best Seller" Badge */}
                                <div className="absolute top-0 left-0 z-10 rounded-br-lg bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                                    {product.badge}
                                </div>

                                {/* Product Header with Gradient Background */}
                                <div className="relative rounded-t-xl bg-gradient-to-r from-indigo-800 to-purple-800 p-4 pb-12 text-white">
                                    <span className="text-xs font-semibold">{product.type}</span>
                                    <h3 className="mt-1 text-2xl font-bold">{product.name}</h3>
                                    {/* Placeholder for "Espresso Roastead By: Igaffi" - use a simple text or SVG */}
                                    <div className="absolute right-4 bottom-3 text-xs font-medium text-gray-300">
                                        ESPRESSO ROASTED BY: <span className="font-bold">IGaffi</span>
                                    </div>
                                </div>

                                {/* Product Details Section */}
                                <div className="relative -mt-8 rounded-b-xl bg-white p-4">
                                    <span className="mb-3 inline-block rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-800">
                                        {product.blend}
                                    </span>
                                    <h4 className="mb-2 text-lg font-semibold text-gray-800">The Sagara 1999</h4>
                                    <p className="mb-4 text-sm text-gray-600">{product.description}</p>

                                    <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-gray-700">
                                        <div>
                                            <span className="font-semibold">Origin:</span> {product.origin}
                                        </div>
                                        <div className="text-right">
                                            <span className="font-semibold">Roast:</span> {product.roast}
                                        </div>
                                    </div>

                                    <div className="mb-4 text-xl font-bold text-indigo-600">{product.price}</div>

                                    <div className="flex flex-col space-y-2">
                                        <button className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-indigo-700">
                                            {/* Shopping cart icon */}
                                            <svg
                                                className="mr-2 h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                ></path>
                                            </svg>
                                            Add to Cart
                                        </button>
                                        <button className="flex w-full items-center justify-center rounded-lg border border-indigo-600 px-4 py-3 font-semibold text-indigo-600 shadow-md transition-colors duration-200 hover:bg-indigo-50">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </AppHeaderLayout>
    );
}
