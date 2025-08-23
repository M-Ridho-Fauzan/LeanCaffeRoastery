/**
 * @description      :
 * @author           : Ridho Fauzan
 * @group            :
 * @created          : 23/08/2025 - 21:19:53
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 23/08/2025
 * - Author          : Ridho Fauzan
 * - Modification    :
 **/
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useResponsive } from '@/hooks/use-responsive';
import { Filter } from 'lucide-react';
import React from 'react';

// --- DEFINISI TIPE YANG SPESIFIK (MENGGANTIKAN 'any') ---

/** Bentuk state filter yang sedang aktif */
interface ActiveFilters {
    origin: string;
    process: string;
    type: string;
}

/** Tipe data untuk opsi Origin dari API */
interface OriginOption {
    id: number;
    origin_name: string;
}

/** Tipe data untuk opsi Process dari API */
interface ProcessOption {
    id: number;
    process_name: string;
}

/** Tipe gabungan untuk prop filterOptions */
interface FilterOptionsProp {
    origins: OriginOption[];
    processes: ProcessOption[];
    types: string[];
}

/**
 * Tipe generik untuk opsi di dalam RadioGroup.
 * Memastikan setiap opsi punya 'id' dan properti lain (berupa string/number)
 * yang bisa diakses via `nameKey`.
 */
interface RadioOption {
    id: number | string;
    [key: string]: string | number;
}

/** Props untuk komponen helper FilterRadioGroup */
interface FilterRadioGroupProps {
    title: string;
    options: RadioOption[];
    nameKey: string; // Kunci untuk mendapatkan nama tampilan dari objek `options`
    value: string;
    onValueChange: (value: string) => void;
}

/** Props untuk komponen utama ProductFilters */
interface ProductFiltersProps {
    filterOptions: FilterOptionsProp;
    filters: ActiveFilters;
    setFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
    onReset: () => void;
    resultCount: number;
}

// --- Komponen RadioGroup Helper (Sekarang Type-Safe) ---
const FilterRadioGroup: React.FC<FilterRadioGroupProps> = ({ title, options, nameKey, value, onValueChange }) => (
    <div>
        <Label className="text-base font-semibold">{title}</Label>
        <RadioGroup value={value} onValueChange={onValueChange} className="mt-2 space-y-1">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id={`${title}-all`} />
                <Label htmlFor={`${title}-all`} className="cursor-pointer font-normal">
                    Semua
                </Label>
            </div>
            {options.map((option) => (
                <div className="flex items-center space-x-2" key={option.id}>
                    <RadioGroupItem value={String(option.id)} id={`${title}-${option.id}`} />
                    <Label htmlFor={`${title}-${option.id}`} className="cursor-pointer font-normal">
                        {option[nameKey]} {/* TypeScript sekarang tahu ini valid */}
                    </Label>
                </div>
            ))}
        </RadioGroup>
    </div>
);

// --- KOMPONEN FILTER UTAMA (Sekarang Type-Safe) ---
export const ProductFilters: React.FC<ProductFiltersProps> = ({ filterOptions, filters, setFilters, onReset, resultCount }) => {
    const { isMobile } = useResponsive();

    const FilterContent = (
        <div className="flex-grow space-y-6 overflow-y-auto p-6">
            <FilterRadioGroup
                title="Asal Biji (Origin)"
                options={filterOptions.origins} // Tipe OriginOption kompatibel dengan RadioOption
                nameKey="origin_name"
                value={filters.origin}
                onValueChange={(val) => setFilters((prev) => ({ ...prev, origin: val }))}
            />
            <Separator />
            <FilterRadioGroup
                title="Proses Pasca Panen"
                options={filterOptions.processes} // Tipe ProcessOption kompatibel dengan RadioOption
                nameKey="process_name"
                value={filters.process}
                onValueChange={(val) => setFilters((prev) => ({ ...prev, process: val }))}
            />
            <Separator />
            <FilterRadioGroup
                title="Jenis Biji"
                // Kita transform array string menjadi array objek yang sesuai dengan RadioOption
                options={filterOptions.types.map((t) => ({ id: t, name: t }))}
                nameKey="name"
                value={filters.type}
                onValueChange={(val) => setFilters((prev) => ({ ...prev, type: val }))}
            />
        </div>
    );

    const isFilterActive = filters.origin !== 'all' || filters.process !== 'all' || filters.type !== 'all';

    const TriggerButton = (
        <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter Lanjutan
            {isFilterActive && <span className="ml-2 flex h-2 w-2 rounded-full bg-primary" />}
        </Button>
    );

    // Tampilan Mobile: Gunakan Dialog
    if (isMobile) {
        return (
            <Dialog>
                <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
                <DialogContent className="flex h-[85%] flex-col sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Filter Lanjutan</DialogTitle>
                        <DialogDescription>Persempit pencarian kopi Anda.</DialogDescription>
                    </DialogHeader>
                    {FilterContent}
                    <DialogFooter className="mt-auto flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                        <Button variant="ghost" onClick={onReset} className="w-full sm:w-auto">
                            Atur Ulang
                        </Button>
                        <DialogClose asChild>
                            <Button className="w-full sm:w-auto">Lihat {resultCount} Produk</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // Tampilan Desktop & Tablet: Gunakan Sheet
    return (
        <Sheet>
            <SheetTrigger asChild>{TriggerButton}</SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Filter Lanjutan</SheetTitle>
                    <SheetDescription>Persempit pencarian kopi untuk menemukan rasa yang sempurna.</SheetDescription>
                </SheetHeader>
                {FilterContent}
                <SheetFooter className="mt-auto flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-between">
                    <Button variant="ghost" onClick={onReset} className="w-full sm:w-auto">
                        Atur Ulang
                    </Button>
                    <SheetClose asChild>
                        <Button className="w-full sm:w-auto">Terapkan</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
