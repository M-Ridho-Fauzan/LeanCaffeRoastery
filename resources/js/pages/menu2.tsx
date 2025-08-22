/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 23/08/2025 - 02:06:14
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 23/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
// resources/js/Pages/Menu/Index.tsx

// Import semua yang dibutuhkan
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Import Shadcn Card
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { BreadcrumbItem, MenuItem, MenuTag } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Beaker, Coffee, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MenuCardSkeleton } from './page_skeleton/page/menu2-card-skeleton';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Menu2',
        href: '/menu2',
    },
];

interface MenuProps {
    menuItems: MenuItem[];
}

export default function Menu2({ menuItems }: MenuProps) {
    // 1. Buat state untuk melacak status loading
    const [isLoading, setIsLoading] = useState(false);

    // 2. Gunakan useEffect untuk memasang event listener Inertia
    useEffect(() => {
        const removeStartListener = router.on('start', () => {
            setIsLoading(true);
        });

        const removeFinishListener = router.on('finish', () => {
            setIsLoading(false);
        });

        // Cleanup: Hapus listener saat komponen di-unmount untuk mencegah memory leak
        return () => {
            removeStartListener();
            removeFinishListener();
        };
    }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali saat mount

    // Helper untuk memisahkan tags berdasarkan tipe
    const getTagsByType = (tags: MenuTag[], type: MenuTag['type']) => {
        return tags.filter((tag) => tag.type === type);
    };

    console.log('Menu Items:', menuItems);

    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>
            <Head title="Menu Kopi">
                <h2 className="text-xl leading-tight font-semibold text-gray-800">Our Coffee Selection</h2>
            </Head>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* 3. Lakukan Conditional Rendering di sini */}
                        {isLoading
                            ? // Tampilkan 6 skeleton saat loading
                              Array.from({ length: 6 }).map((_, index) => <MenuCardSkeleton key={index} />)
                            : // Tampilkan data asli jika tidak loading
                              menuItems.map((item) => (
                                  <Card key={item.id} className="flex flex-col">
                                      {/* ... Isi Card Anda yang sudah ada ... */}
                                      <CardHeader>
                                          <img
                                              src={item.image_url || 'https://via.placeholder.com/400?text=No+Image'}
                                              alt={item.name}
                                              className="mb-4 h-48 w-full rounded-lg object-cover"
                                          />
                                          <CardTitle className="text-2xl">{item.name}</CardTitle>
                                          <CardDescription>{item.origin}</CardDescription>
                                      </CardHeader>
                                      <CardContent className="flex-grow">
                                          <p className="mb-4 text-sm text-muted-foreground">{item.description}</p>

                                          {/* Menampilkan Roast Level */}
                                          {item.roast_level && (
                                              <div className="mb-4 flex items-center gap-2">
                                                  <Flame className="h-4 w-4 text-orange-500" />
                                                  <span className="font-semibold">Roast Level:</span>
                                                  <Badge variant="secondary">{item.roast_level.name}</Badge>
                                              </div>
                                          )}

                                          {/* Menampilkan Flavor Notes */}
                                          <div className="mb-4">
                                              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                                                  <Coffee className="h-4 w-4 text-amber-800" /> Flavor Notes
                                              </h4>
                                              <div className="flex flex-wrap gap-2">
                                                  {getTagsByType(item.tags, 'flavor_note').map((tag) => (
                                                      <Badge key={tag.id} variant="outline">
                                                          {tag.name}
                                                      </Badge>
                                                  ))}
                                              </div>
                                          </div>

                                          {/* Menampilkan Brewing Methods */}
                                          <div>
                                              <h4 className="mb-2 flex items-center gap-2 font-semibold">
                                                  <Beaker className="h-4 w-4 text-blue-500" /> Recommended Brewing
                                              </h4>
                                              <div className="flex flex-wrap gap-2">
                                                  {getTagsByType(item.tags, 'brewing_method').map((tag) => (
                                                      <Badge key={tag.id} variant="outline">
                                                          {tag.name}
                                                      </Badge>
                                                  ))}
                                              </div>
                                          </div>
                                      </CardContent>
                                      <CardFooter className="mt-4 flex items-center justify-between">
                                          <span className="text-2xl font-bold text-green-600">
                                              Rp {new Intl.NumberFormat('id-ID').format(Number(item.price))}
                                          </span>
                                      </CardFooter>
                                  </Card>
                              ))}

                        {/* Tampilkan pesan jika tidak loading DAN tidak ada menu */}
                        {!isLoading && menuItems.length === 0 && (
                            <div className="col-span-full overflow-hidden bg-white shadow-sm sm:rounded-lg">
                                <p className="p-6 text-gray-900">Saat ini belum ada menu yang tersedia.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppHeaderLayout>
    );
}
