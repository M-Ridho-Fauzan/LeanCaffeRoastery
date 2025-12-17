import { Link } from '@inertiajs/react'; // Gunakan Link inertia jika project inertia, atau 'next/link' jika Next.js
import { Instagram } from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

export default function AppFooter() {
    return (
        <footer className="border-t border-white/10 bg-[#2e236c] pt-16 pb-8 text-white">
            <div className="container mx-auto px-6 md:px-12">
                <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* 1. Logo & Slogan Column */}
                    <div className="flex flex-col items-start">
                        {/* Logo Placeholder - Ganti <img> ini dengan file logo asli Anda */}
                        <div className="mb-4">
                            <AppLogoIcon className="size-32 fill-current text-white dark:text-[#303182]" />
                        </div>

                        <h2 className="max-w-[200px] text-lg leading-snug font-bold tracking-widest text-white/90 uppercase">
                            BALANCE & <br /> BRIGHTNESS CUP
                        </h2>
                    </div>

                    {/* 2. Quick Links Column */}
                    <div>
                        <h3 className="mb-6 text-sm font-bold tracking-widest text-white uppercase">Quick Links</h3>
                        <ul className="flex flex-col gap-3 text-sm text-gray-300">
                            <li>
                                <Link href={route('home')} className="transition-colors hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href={route('about')} className="transition-colors hover:text-white">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href={route('products.index')} className="transition-colors hover:text-white">
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link href={route('blog.index')} className="transition-colors hover:text-white">
                                    Articles
                                </Link>
                            </li>
                            <li>
                                <Link href={route('location')} className="transition-colors hover:text-white">
                                    Location
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 3. Product Column */}
                    <div>
                        <h3 className="mb-6 text-sm font-bold tracking-widest text-white uppercase">Product</h3>
                        <ul className="flex flex-col gap-3 text-sm text-gray-300">
                            <li>
                                <Link href={route('products.index')} className="transition-colors hover:text-white">
                                    Coffee Beans
                                </Link>
                            </li>
                            <li>
                                <Link href={route('products.index')} className="transition-colors hover:text-white">
                                    Ground Coffee
                                </Link>
                            </li>
                            <li>
                                <Link href={route('products.index')} className="transition-colors hover:text-white">
                                    Cold Brew
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 4. Follow Us Column */}
                    <div>
                        <h3 className="mb-6 text-sm font-bold tracking-widest text-white uppercase">Follow Us</h3>
                        <div className="flex">
                            <a
                                href="https://www.instagram.com/leancoffee.roastery/"
                                className="rounded-xl border border-white/10 bg-[#241b57] p-3 shadow-lg transition-colors hover:bg-[#3d3185]"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-6 w-6 text-white" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="border-t border-white/10 pt-8 text-center">
                    <p className="text-sm text-gray-400">© 2024 Powered by Lean Coffee Roastery</p>
                </div>
            </div>
        </footer>
    );
}
