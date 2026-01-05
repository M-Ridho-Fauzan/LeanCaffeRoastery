/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 19/08/2025 - 00:40:35
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 19/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import { Breadcrumbs } from '@/components/breadcrumbs';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';

import { useScrollDirection } from '@/hooks/use-scroll-direction';
import AppLogoOnly from './app-logo-only';
import { DesktopNavMenu } from './desktop-nav-menu';
import { HeaderActions } from './header-actions';
import { MobileNavSheet } from './mobile-nav-sheet';

// Impor komponen-komponen baru

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    // Gunakan custom hook untuk mendeteksi arah scroll
    const { scrollDirection, isAtTop } = useScrollDirection();

    // Hitung tinggi total header untuk spacer
    const totalHeaderHeightClass = breadcrumbs.length > 1 ? 'h-[112px]' : 'h-16'; // h-16 + h-12 = 112px

    return (
        <>
            <div className={totalHeaderHeightClass}></div>

            <div
                className={cn(
                    'fixed top-0 z-50 flex w-full border-b border-sidebar-border/80 bg-[#D2D3D5] transition-transform duration-300 ease-in-out',
                    {
                        'translate-y-0': isAtTop || scrollDirection === 'up',
                        '-translate-y-full': scrollDirection === 'down' && !isAtTop,
                    },
                )}
            >
                {/* Bagian utama header */}
                <div className="mx-auto flex h-16 w-full items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu Trigger & Content */}
                    <div className="lg:hidden">
                        <MobileNavSheet />
                    </div>

                    <Link href="/" className="flex items-center space-x-5">
                        {' '}
                        {/* Link ke home, bukan dashboard */}
                        <AppLogoOnly className="size-10 fill-current text-[#303182]" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="mx-auto hidden h-full space-x-6 lg:flex lg:pl-36">
                        <DesktopNavMenu />
                    </div>

                    {/* Right-aligned actions (Search, User Menu, etc.) */}
                    <HeaderActions />
                </div>

                {/* Breadcrumbs - dipindahkan ke dalam container fixed */}
                {breadcrumbs.length > 1 && (
                    <div className="flex w-full">
                        <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
