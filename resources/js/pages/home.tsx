import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Award, Coffee, Star, Users } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
    const primaryColorClass = 'bg-[#2A2F5B] hover:bg-[#1e2345]';
    const textPrimaryColorClass = 'text-[#2A2F5B]';

    const [selectedArticle, setSelectedArticle] = useState<any>(null);

    // Data Artikel disesuaikan dengan konten gambar
    const articles = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
            author: 'Ulas Ahmad',
            initial: 'D', // Inisial untuk avatar
            date: 'Dec 10, 2024',
            title: 'Brewing the Perfect Cup',
            desc: 'Master the techniques for brewing exceptional coffee at home.',
            // Konten HTML simulasi agar sesuai dengan gambar (bullet points, paragraf)
            contentHtml: `
                <div class="space-y-4 text-gray-600 text-sm leading-relaxed">
                    <p class="font-bold text-gray-800">The Art of Perfect Coffee Brewing</p>
                    <p>Brewing the perfect cup of coffee is both an art and a science. It requires understanding the fundamental principles that govern extraction, timing, and technique.</p>
                    
                    <p class="font-bold text-gray-800 mt-4">Essential Equipment</p>
                    <p>Before diving into brewing techniques, let's discuss the essential equipment you'll need:</p>
                    <ul class="list-disc pl-5 space-y-1">
                        <li><strong>Coffee Grinder:</strong> A burr grinder is preferred for consistent particle size</li>
                        <li><strong>Scale:</strong> Precision is key – measure both coffee and water</li>
                        <li><strong>Timer:</strong> Timing your extraction is crucial</li>
                        <li><strong>Quality Water:</strong> Use filtered water for the best taste</li>
                    </ul>

                    <p class="font-bold text-gray-800 mt-4">The Golden Ratio</p>
                    <p>The standard coffee-to-water ratio is 1:15 to 1:17. This means for every gram of coffee, use 15-17 grams of water. Start with 1:16 and adjust to your taste preference.</p>

                    <p class="font-bold text-gray-800 mt-4">Brewing Methods</p>
                    <p>Different brewing methods extract different flavors from your coffee beans:</p>
                    <ul class="list-disc pl-5 space-y-1">
                        <li><strong>Pour Over:</strong> Clean, bright flavors with excellent clarity</li>
                        <li><strong>French Press:</strong> Full-bodied with rich oils and sediment</li>
                        <li><strong>Espresso:</strong> Concentrated, intense flavor with crema</li>
                        <li><strong>Cold Brew:</strong> Smooth, low-acidity coffee perfect for hot days</li>
                    </ul>

                    <p class="font-bold text-gray-800 mt-4">Water Temperature</p>
                    <p>The ideal water temperature for brewing coffee is between 195°F and 205°F (90°C to 96°C). Water that's too hot will over-extract and create bitter flavors, while water that's too cool will under-extract and result in sour, weak coffee.</p>
                </div>
            `,
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
            author: 'Ridho',
            initial: 'R',
            date: 'Oct 15, 2023',
            title: 'Coffee Origins Around the World',
            desc: 'Explore the diverse flavors of coffee beans from different regions. Understand how altitude and soil affect the taste profile.',
            contentHtml: `<p>Content specific for Coffee Origins...</p>`,
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?q=80&w=800&auto=format&fit=crop',
            author: 'Danial Pramudya',
            initial: 'P',
            date: 'Feb 15, 2019',
            title: 'The Art of Coffee Roasting',
            desc: 'Learn about the intricate process of transforming green beans into aromatic coffee. The difference between light, medium, and dark roasts.',
            contentHtml: `<p>Content specific for Coffee Roasting...</p>`,
        },
    ];

    // Filter artikel untuk bagian "Another Articles" (exclude artikel yang sedang dibuka)
    const otherArticles = selectedArticle ? articles.filter((a) => a.id !== selectedArticle.id) : [];

    return (
        <AppHeaderLayout>
            <Head title="Welcome" />

            {/* --- HERO SECTION --- */}
            <section className="relative flex h-[600px] w-full items-center justify-start overflow-hidden bg-slate-900">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=2070&auto=format&fit=crop')",
                    }}
                ></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-950/60 to-transparent"></div>
                <div className="relative z-10 container mx-auto px-6 lg:px-12">
                    <div className="max-w-2xl">
                        <h1 className="mb-8 text-5xl font-bold tracking-tight text-white drop-shadow-md lg:text-6xl">Balance & Brightness Cup</h1>
                        <div className="max-w-lg rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md">
                            <p className="mb-2 text-xs font-medium tracking-wider text-white/80 uppercase">Welcome to Lean Coffee Roastery</p>
                            <p className="mb-6 text-sm leading-relaxed text-gray-200">
                                Experience a new way to explore the finest coffee flavors from selected beans. Discover, order, and enjoy the
                                authentic taste of coffee right in the palm of your hand.
                            </p>
                            <Link href={route('products.index')}>
                                <Button
                                    size="sm"
                                    className={`${primaryColorClass} rounded-full px-6 py-5 text-xs font-bold tracking-wide text-white uppercase shadow-lg transition-all hover:scale-105`}
                                >
                                    <Coffee className="mr-2 h-4 w-4" />
                                    Explore Menu
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STATS SECTION (Tetap sama) --- */}
            <section className="bg-background py-16 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
                        {/* ... Isi stats sama seperti sebelumnya ... */}
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 shadow-inner">
                                <Coffee className={`h-10 w-10 ${textPrimaryColorClass} fill-current`} />
                            </div>
                            <h3 className="text-4xl font-extrabold text-gray-900">50+</h3>
                            <p className="mt-1 text-sm font-medium text-gray-500">Coffee Varieties</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 shadow-inner">
                                <Users className={`h-10 w-10 ${textPrimaryColorClass} fill-current`} />
                            </div>
                            <h3 className="text-4xl font-extrabold text-gray-900">200+</h3>
                            <p className="mt-1 text-sm font-medium text-gray-500">Happy Customers</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 shadow-inner">
                                <Award className={`h-10 w-10 ${textPrimaryColorClass} fill-current`} />
                            </div>
                            <h3 className="text-4xl font-extrabold text-gray-900">5</h3>
                            <p className="mt-1 text-sm font-medium text-gray-500">Years Experience</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 shadow-inner">
                                <Star className={`h-10 w-10 ${textPrimaryColorClass} fill-current`} />
                            </div>
                            <h3 className="text-4xl font-extrabold text-gray-900">4,5</h3>
                            <p className="mt-1 text-sm font-medium text-gray-500">Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- LATEST ARTICLES SECTION --- */}
            <section className="bg-white py-16 pb-24">
                <div className="container mx-auto px-4">
                    <div className="mb-14 text-center">
                        <h2 className={`mb-3 text-3xl font-bold ${textPrimaryColorClass} lg:text-4xl`}>Latest Coffee Articles</h2>
                        <p className="mx-auto max-w-2xl text-sm text-gray-500">
                            Discover the world of coffee through our expert insights and brewing guides
                        </p>
                    </div>

                    <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                article={article}
                                primaryColorClass={primaryColorClass}
                                onReadMore={() => setSelectedArticle(article)}
                            />
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link href={route('blog.index')}>
                            <Button className={`${primaryColorClass} h-12 rounded-lg px-8 text-sm font-bold shadow-md`}>View All Articles</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- POP-UP MODAL SESUAI DESAIN --- */}
            <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
                <DialogContent className="scrollbar-hide max-h-[90vh] max-w-4xl overflow-y-auto rounded-xl bg-white p-8 sm:p-10">
                    {selectedArticle && (
                        <>
                            {/* 1. Header: Title Centered */}
                            <DialogHeader className="mb-6 flex flex-col items-center text-center">
                                <DialogTitle className={`text-2xl font-bold ${textPrimaryColorClass} md:text-3xl`}>
                                    {selectedArticle.title}
                                </DialogTitle>
                            </DialogHeader>

                            {/* 2. Author & Date Row */}
                            <div className="mb-8 flex w-full items-center justify-between border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-3">
                                    {/* Avatar Lingkaran */}
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${primaryColorClass} font-bold text-white`}
                                    >
                                        {selectedArticle.initial}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">{selectedArticle.author}</span>
                                </div>
                                <span className="text-xs font-medium text-gray-400">{selectedArticle.date}</span>
                            </div>

                            {/* 3. Featured Image (Centered) */}
                            <div className="mb-8 flex justify-center">
                                <div className="w-full max-w-md overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                                    <img src={selectedArticle.image} alt={selectedArticle.title} className="h-auto w-full object-cover" />
                                </div>
                            </div>

                            {/* 4. Rich Text Content */}
                            {/* Menggunakan dangerouslySetInnerHTML untuk merender HTML dari data */}
                            <div className="mx-auto mb-12 max-w-3xl" dangerouslySetInnerHTML={{ __html: selectedArticle.contentHtml }} />

                            {/* 5. "Another Articles" Section (Footer Modal) */}
                            <div className="mt-8 border-t border-gray-100 pt-8">
                                <h3 className={`text-center text-xl font-bold ${textPrimaryColorClass} mb-8`}>Another Articles</h3>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    {otherArticles.slice(0, 2).map((article) => (
                                        // Menggunakan Card versi mini untuk di dalam modal
                                        <div
                                            key={article.id}
                                            className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                                        >
                                            <div className="h-48 w-full overflow-hidden">
                                                <img
                                                    src={article.image}
                                                    alt={article.title}
                                                    className="h-full w-full object-cover transition-transform hover:scale-105"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col p-5">
                                                <div className="mb-2 text-[10px] text-gray-500">
                                                    <span className="font-bold text-gray-800">{article.author}</span> • {article.date}
                                                </div>
                                                <h4 className="text-md mb-2 font-bold text-gray-900">{article.title}</h4>
                                                <p className="mb-4 line-clamp-2 text-xs text-gray-500">{article.desc}</p>
                                                <div className="mt-auto">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            // Ganti artikel saat ini dengan artikel yang diklik di "Another Articles"
                                                            // Scroll ke atas agar user sadar konten berubah
                                                            setSelectedArticle(article);
                                                            document.querySelector('[role="dialog"]')?.scrollTo(0, 0);
                                                        }}
                                                        className={`${primaryColorClass} h-7 rounded-full px-4 text-[10px]`}
                                                    >
                                                        Read More <ArrowRight className="ml-1 h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </AppHeaderLayout>
    );
}

// Komponen Helper ArticleCard (untuk halaman utama)
function ArticleCard({ article, primaryColorClass, onReadMore }: any) {
    return (
        <Card className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
            <div className="h-64 w-full shrink-0 overflow-hidden">
                <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            <CardContent className="flex flex-grow flex-col p-6">
                <div className="mb-3 flex items-center text-[11px] font-semibold text-gray-500">
                    <span className="text-gray-900">{article.author}</span>
                    <span className="mx-2">•</span>
                    <span>{article.date}</span>
                </div>

                <h3 className="mb-3 text-lg leading-tight font-bold text-gray-900 group-hover:text-indigo-900">{article.title}</h3>

                <p className="mb-6 line-clamp-2 text-xs leading-relaxed text-gray-500">{article.desc}</p>

                <div className="mt-auto">
                    <Button
                        size="sm"
                        onClick={onReadMore}
                        className={`${primaryColorClass} h-8 w-auto rounded-full px-4 text-[10px] font-bold text-white`}
                    >
                        Read More
                        <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
