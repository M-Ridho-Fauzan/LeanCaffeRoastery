import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head } from '@inertiajs/react';
import { Award, Coffee, Star, Users } from 'lucide-react';

export default function LandingPage() {
    return (
        <AppHeaderLayout>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-20 text-white">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <div className="mx-auto max-w-4xl">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div>
                                <h1 className="mb-6 text-4xl leading-tight font-bold lg:text-5xl">Balance & Brightness Cup</h1>
                                <p className="mb-8 text-lg leading-relaxed text-slate-200 lg:text-xl">
                                    Welcome to Learn Coffee Roasting. Discover a new way to explore and enjoy coffee right from the comfort of your
                                    home. Master the art of brewing with our expert guidance.
                                </p>
                                <Button size="lg" className="rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700">
                                    Learn More
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="relative mx-auto h-80 w-80">
                                    <img
                                        src="/elegant-coffee-cup.png"
                                        alt="Coffee Cup"
                                        className="h-full w-full rounded-full object-cover shadow-2xl"
                                    />
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-background py-16">
                <div className="container mx-auto px-4">
                    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 lg:grid-cols-4">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                <Coffee className="h-8 w-8 text-slate-700" />
                            </div>
                            <h3 className="mb-2 text-3xl font-bold text-foreground">50+</h3>
                            <p className="text-muted-foreground">Coffee Varieties</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                <Users className="h-8 w-8 text-slate-700" />
                            </div>
                            <h3 className="mb-2 text-3xl font-bold text-foreground">200+</h3>
                            <p className="text-muted-foreground">Happy Customers</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                <Award className="h-8 w-8 text-slate-700" />
                            </div>
                            <h3 className="mb-2 text-3xl font-bold text-foreground">5</h3>
                            <p className="text-muted-foreground">Years Experience</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                <Star className="h-8 w-8 text-slate-700" />
                            </div>
                            <h3 className="mb-2 text-3xl font-bold text-foreground">4,5</h3>
                            <p className="text-muted-foreground">Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-muted/30 py-16">
                <div className="container mx-auto px-4">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">Latest Coffee Articles</h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Discover the world of coffee through our expert insights and brewing guides
                        </p>
                    </div>

                    <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src="/placeholder-bxlwd.png"
                                    alt="Brewing the Perfect Cup"
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <CardContent className="p-6">
                                <div className="mb-2 text-sm text-muted-foreground">
                                    <span className="rounded bg-slate-100 px-2 py-1 text-xs">TUTORIAL</span>
                                    <span className="ml-2">Sep 15, 2024</span>
                                </div>
                                <h3 className="mb-3 text-xl font-semibold text-foreground">Brewing the Perfect Cup</h3>
                                <p className="mb-4 leading-relaxed text-muted-foreground">
                                    Master the essential tips and techniques to brew your perfect cup of coffee every time.
                                </p>
                                <Button variant="outline" size="sm" className="border-indigo-600 bg-transparent text-indigo-600 hover:bg-indigo-50">
                                    Read More
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src="/placeholder-ahhua.png"
                                    alt="Coffee Origins Around the World"
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <CardContent className="p-6">
                                <div className="mb-2 text-sm text-muted-foreground">
                                    <span className="rounded bg-slate-100 px-2 py-1 text-xs">GUIDE</span>
                                    <span className="ml-2">Sep 10, 2024</span>
                                </div>
                                <h3 className="mb-3 text-xl font-semibold text-foreground">Coffee Origins Around the World</h3>
                                <p className="mb-4 leading-relaxed text-muted-foreground">
                                    Explore the fascinating journey of coffee and how different regions create unique flavors.
                                </p>
                                <Button variant="outline" size="sm" className="border-indigo-600 bg-transparent text-indigo-600 hover:bg-indigo-50">
                                    Read More
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src="/placeholder-uiurx.png"
                                    alt="The Art of Coffee Roasting"
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <CardContent className="p-6">
                                <div className="mb-2 text-sm text-muted-foreground">
                                    <span className="rounded bg-slate-100 px-2 py-1 text-xs">TECHNIQUE</span>
                                    <span className="ml-2">Sep 05, 2024</span>
                                </div>
                                <h3 className="mb-3 text-xl font-semibold text-foreground">The Art of Coffee Roasting</h3>
                                <p className="mb-4 leading-relaxed text-muted-foreground">
                                    Learn about the intricate process of coffee roasting and how it transforms flavor profiles.
                                </p>
                                <Button variant="outline" size="sm" className="border-indigo-600 bg-transparent text-indigo-600 hover:bg-indigo-50">
                                    Read More
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-12 text-center">
                        <Button variant="outline" size="lg" className="bg-transparent px-8">
                            View All Articles
                        </Button>
                    </div>
                </div>
            </section>
        </AppHeaderLayout>
    );
}
