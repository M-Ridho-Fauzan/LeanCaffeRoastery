import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useResponsive } from '@/hooks/use-responsive';
import { Filter, RefreshCcw } from 'lucide-react';
import React from 'react';

// --- DEFINISI TIPE YANG SPESIFIK ---

/** PERUBAHAN 1: Sesuaikan ActiveFilters agar match dengan query parameter backend */
interface ActiveFilters {
    origin_id: string;
    process_id: string;
    type: string;
    brew_method_id: string; // Tambahkan ini agar semua filter ada di sini
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
    // brewMethods tidak perlu di sini karena sudah dihandle di tabs
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
    filters: ActiveFilters; // Filter yang sedang aktif dari parent
    setFilters: (newFilters: ActiveFilters) => void; // Callback untuk update filter di parent
    onReset: () => void;
    resultCount: number;
}

// --- Komponen RadioGroup Helper (Tidak berubah) ---
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
                        {option[nameKey]}
                    </Label>
                </div>
            ))}
        </RadioGroup>
    </div>
);

// --- KOMPONEN FILTER UTAMA ---
export const ProductFilters: React.FC<ProductFiltersProps> = ({ filterOptions, filters, setFilters, onReset, resultCount }) => {
    const { isMobile } = useResponsive();

    // PERUBAHAN 2: State internal untuk menampung perubahan sementara
    const [localFilters, setLocalFilters] = React.useState<ActiveFilters>(filters);
    const [isOpen, setIsOpen] = React.useState(false); // State untuk mengontrol buka/tutup Dialog/Sheet

    // PERUBAHAN 3: Sinkronkan localFilters dengan filters dari props
    // Ini penting agar saat `onReset` dipanggil dari parent, filter di dialog juga ikut reset
    React.useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    // PERUBAHAN 4: Handler untuk menerapkan filter
    const handleApplyFilters = () => {
        setFilters(localFilters); // Kirim localFilters ke parent
        setIsOpen(false); // Tutup dialog/sheet
    };

    // PERUBAHAN 5: Handler untuk mereset filter
    const handleReset = () => {
        onReset(); // Panggil onReset dari parent
        setIsOpen(false); // Tutup dialog/sheet
    };

    const FilterContent = (
        <div className="flex-grow space-y-6 overflow-y-auto p-6">
            <FilterRadioGroup
                title="Asal Biji (Origin)"
                options={filterOptions.origins.map((origin) => ({ id: origin.id, name: origin.origin_name }))}
                nameKey="name"
                value={localFilters.origin_id} // Gunakan localFilters
                onValueChange={(val) => setLocalFilters((prev) => ({ ...prev, origin_id: val }))} // Update localFilters
            />
            <Separator />
            <FilterRadioGroup
                title="Proses Pasca Panen"
                options={filterOptions.processes.map((p) => ({ id: p.id, name: p.process_name }))}
                nameKey="name"
                value={localFilters.process_id} // Gunakan localFilters
                onValueChange={(val) => setLocalFilters((prev) => ({ ...prev, process_id: val }))} // Update localFilters
            />
            <Separator />
            <FilterRadioGroup
                title="Jenis Biji"
                options={filterOptions.types.map((t) => ({ id: t, name: t }))}
                nameKey="name"
                value={localFilters.type} // Gunakan localFilters
                onValueChange={(val) => setLocalFilters((prev) => ({ ...prev, type: val }))} // Update localFilters
            />
        </div>
    );

    // PERUBAHAN 6: Periksa filter aktif berdasarkan localFilters
    const isFilterActive =
        localFilters.origin_id !== 'all' || localFilters.process_id !== 'all' || localFilters.type !== 'all' || localFilters.brew_method_id !== 'all';

    const TriggerButton = (
        <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter Lanjutan
            {isFilterActive && <span className="ml-2 flex h-2 w-2 rounded-full bg-green-700" />}
        </Button>
    );

    const ResetButton = (
        <Button variant="outline" size="sm" onClick={handleReset} className="mt-4 w-full sm:mt-0 sm:w-auto">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset Filter
        </Button>
    );

    // Tampilan Mobile: Gunakan Dialog
    if (isMobile) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {' '}
                {/* Kontrol buka/tutup dengan state `isOpen` */}
                <div className="m-auto flex flex-col *:my-1">
                    {isFilterActive && ResetButton}
                    <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
                </div>
                <DialogContent className="flex h-[85%] flex-col sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Filter Lanjutan</DialogTitle>
                        <DialogDescription>Persempit pencarian kopi Anda.</DialogDescription>
                    </DialogHeader>
                    {FilterContent}
                    <DialogFooter className="mt-auto flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                        <Button variant="ghost" onClick={handleReset} className="w-full sm:w-auto">
                            Atur Ulang
                        </Button>
                        {/* Tombol ini akan menerapkan filter dan menutup dialog */}
                        <Button onClick={handleApplyFilters} className="w-full sm:w-auto">
                            Lihat {resultCount} Produk
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    // Tampilan Desktop & Tablet: Gunakan Sheet
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            {' '}
            {/* Kontrol buka/tutup dengan state `isOpen` */}
            <div className="flex *:mx-1">
                {isFilterActive && ResetButton}
                {/* {ResetButton} */}
                <SheetTrigger asChild>{TriggerButton}</SheetTrigger>
            </div>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Filter Lanjutan</SheetTitle>
                    <SheetDescription>Persempit pencarian kopi untuk menemukan rasa yang sempurna.</SheetDescription>
                </SheetHeader>
                {FilterContent}
                <SheetFooter className="mt-auto flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-between">
                    <Button variant="ghost" onClick={handleReset} className="w-full sm:w-auto">
                        Atur Ulang
                    </Button>
                    {/* Tombol ini akan menerapkan filter dan menutup sheet */}
                    <Button onClick={handleApplyFilters} className="w-full sm:w-auto">
                        Terapkan
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
