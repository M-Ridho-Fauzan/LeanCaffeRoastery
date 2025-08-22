/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 23/08/2025 - 02:41:24
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 23/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MenuCardSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                {/* Skeleton untuk gambar */}
                <Skeleton className="mb-4 h-48 w-full rounded-lg" />
                {/* Skeleton untuk judul */}
                <Skeleton className="h-8 w-3/4" />
                {/* Skeleton untuk deskripsi/origin */}
                <Skeleton className="mt-1 h-4 w-1/2" />
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                {/* Skeleton untuk deskripsi panjang */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />

                {/* Skeleton untuk bagian tags */}
                <div className="space-y-3 pt-2">
                    <Skeleton className="h-5 w-1/3" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="mt-4 flex items-center justify-between">
                {/* Skeleton untuk harga */}
                <Skeleton className="h-8 w-1/3" />
            </CardFooter>
        </Card>
    );
}
