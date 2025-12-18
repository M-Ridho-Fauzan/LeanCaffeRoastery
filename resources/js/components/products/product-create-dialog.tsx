// resources/js/components/products/ProductCreateDialog.tsx

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BrewMethod, Origin, Process } from '@/types';
import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import React from 'react';

interface Props {
    origins: Origin[];
    processes: Process[];
    brewMethods: BrewMethod[];
    types: string[];
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProductCreateDialog({ origins, processes, brewMethods, types, isOpen, onOpenChange }: Props) {
    // 1. Perbaikan Hooks: Pastikan semua hooks di panggil di level teratas komponen.
    const { data, setData, post, processing, errors, reset } = useForm({
        product_name: '',
        description: '', // Map ke flavor_notes
        price: 0,
        type: '', // Category
        stock: 0,
        // Relasi Many-to-Many
        origin_ids: [] as number[],
        process_ids: [] as number[],
        brew_method_ids: [] as number[],
        // Untuk Gambar: Mendukung multiple file upload
        image_files: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Menggunakan Inertia POST dengan file upload
        post(route('products.store'), {
            forceFormData: true, // WAJIB untuk file upload
            onSuccess: () => {
                onOpenChange(false);
                reset();
                // Clear state file names jika Anda menggunakannya
                // setFileNames([]);
            },
        });
    };

    // Helper untuk toggle array (relasi M:M)
    const toggleId = (field: 'origin_ids' | 'process_ids' | 'brew_method_ids', id: number) => {
        const current = [...data[field]];
        const index = current.indexOf(id);
        if (index > -1) current.splice(index, 1);
        else current.push(id);
        setData(field, current);
    };

    // Perbaikan Logika Multi-File Upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            // Mengambil semua file dari input dan menyimpannya di state
            const filesArray = Array.from(e.target.files);
            setData('image_files', filesArray);
        }
    };

    // Hapus file dari list
    const handleRemoveFile = (indexToRemove: number) => {
        const updatedFiles = data.image_files.filter((_, index) => index !== indexToRemove);
        setData('image_files', updatedFiles);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ... (Form Product Name, Description, Price, Type, Stock) tetap sama */}
                    <div className="space-y-2">
                        <Label htmlFor="product_name">Product Name</Label>
                        <Input
                            id="product_name"
                            placeholder="Enter Product Name"
                            value={data.product_name}
                            onChange={(e) => setData('product_name', e.target.value)}
                        />
                        {errors.product_name && <p className="text-xs text-red-500">{errors.product_name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Product Description (Flavor Notes)"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (IDR)</Label>
                            <Input id="price" type="number" value={data.price} onChange={(e) => setData('price', parseInt(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select onValueChange={(val) => setData('type', val)} value={data.type}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {types.map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input id="stock" type="number" value={data.stock} onChange={(e) => setData('stock', parseInt(e.target.value))} />
                        </div>
                    </div>

                    {/* --- Image Upload Area (Perbaikan) --- */}
                    <div className="space-y-2 rounded-lg border border-dashed bg-gray-50 p-4 text-center">
                        <div className="flex items-center justify-center">
                            <Input id="file-upload" type="file" multiple className="sr-only" onChange={handleFileChange} />
                            <p className="text-sm font-medium">
                                Drag & drop files or{' '}
                                <Label htmlFor="file-upload" className="cursor-pointer text-indigo-600 hover:underline">
                                    Browse
                                </Label>
                            </p>
                        </div>
                        <p className="text-xs text-gray-500">Supported formats: JPG, PNG, JPEG</p>
                    </div>

                    {/* Daftar File yang di Upload */}
                    {data.image_files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-1 text-sm">
                            <span>{file.name}</span>
                            <Trash2 className="h-4 w-4 cursor-pointer text-red-500" onClick={() => handleRemoveFile(index)} />
                        </div>
                    ))}
                    {/* Tombol Upload File Terpisah (Sesuai Design) */}
                    {data.image_files.length > 0 && (
                        <Button type="button" variant="secondary" className="w-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                            Upload File
                        </Button>
                    )}
                    {/* --- End Image Upload --- */}

                    {/* --- Relasi Tambahan (Origins, Processes, Brew Methods) --- */}
                    <div className="space-y-2 pt-4">
                        <Label className="mb-2 block">Origin</Label>
                        <div className="flex flex-wrap gap-2">
                            {origins.map((o) => (
                                <Button
                                    type="button"
                                    key={o.id}
                                    variant={data.origin_ids.includes(o.id) ? 'default' : 'outline'}
                                    onClick={() => toggleId('origin_ids', o.id)}
                                    size="sm"
                                >
                                    {o.origin_name}
                                </Button>
                            ))}
                        </div>

                        <Label className="mb-2 block pt-4">Process</Label>
                        <div className="flex flex-wrap gap-2">
                            {processes.map((p) => (
                                <Button
                                    type="button"
                                    key={p.id}
                                    variant={data.process_ids.includes(p.id) ? 'default' : 'outline'}
                                    onClick={() => toggleId('process_ids', p.id)}
                                    size="sm"
                                >
                                    {p.process_name}
                                </Button>
                            ))}
                        </div>

                        <Label className="mb-2 block pt-4">Brew Method</Label>
                        <div className="flex flex-wrap gap-2">
                            {brewMethods.map((b) => (
                                <Button
                                    type="button"
                                    key={b.id}
                                    variant={data.brew_method_ids.includes(b.id) ? 'default' : 'outline'}
                                    onClick={() => toggleId('brew_method_ids', b.id)}
                                    size="sm"
                                >
                                    {b.brew_name}
                                </Button>
                            ))}
                        </div>
                    </div>
                    {/* --- End Relasi Tambahan --- */}

                    <Button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-800" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
