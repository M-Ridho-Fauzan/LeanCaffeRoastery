import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type PageProps } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { pickBy, throttle } from 'lodash';
import { Check, ChevronsUpDown, CloudUpload, Filter, Plus, Search, SquarePen, Trash2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'; // Impor React
import { toast } from 'sonner';

// --- Definisi Tipe ---
interface Tag {
    // Tipe Baru: Tag
    id: number;
    name: string;
    slug: string;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image_url: string | null;
    published_at: string | null;
    status: 'draft' | 'published' | 'archived';
    views_count: number;
    created_at: string;
    updated_at: string;
    category: {
        id: number;
        name: string;
        slug: string;
    } | null;
    author: {
        id: number;
        name: string;
        email: string;
    };
    tags: Tag[];
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

// Tambahkan Tipe tags ke sini
interface ArticlesIndexSpecificProps {
    articles: {
        data: Article[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        current_page: number;
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        category?: string;
        status?: 'draft' | 'published' | 'archived';
    };
    categories: {
        data: Category[];
    };
    tags: {
        // Struktur yang sama dengan Category (Resource Collection)
        data: Tag[];
    };
    statuses: ('draft' | 'published' | 'archived')[];
    breadcrumbs: BreadcrumbItem[];
    // Tambahkan flash type jika ada di PageProps
    flash: PageProps['flash'];
}

type ArticlesIndexPageProps = PageProps & ArticlesIndexSpecificProps;

// Hapus eslint-disable-next-line karena sekarang 'tags' digunakan
export default function ArticleIndex({ articles, filters, categories, tags, statuses, breadcrumbs, flash }: ArticlesIndexPageProps) {
    const [search, setSearch] = useState(filters.search || '');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');

    // State untuk Dialog Delete
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

    const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
    const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);

    // State untuk Dialog Add Article
    const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);

    // --- STATE BARU UNTUK EDIT ---
    const [isEditArticleOpen, setIsEditArticleOpen] = useState(false);
    const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);

    const { delete: inertiaDelete, processing, errors } = useForm();

    const throttledApplyFilters = useRef(
        throttle((s: string, c: string, st: string) => {
            router.get(
                route('editor.articles.index'),
                // ... (Logic Filter)
                pickBy(
                    {
                        search: s,
                        category: c !== 'all' ? c : undefined,
                        status: st !== 'all' ? st : undefined,
                    },
                    (value) => value !== undefined && value !== '',
                ),
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                },
            );
        }, 300),
    ).current;

    useEffect(() => {
        throttledApplyFilters(search, selectedCategory, selectedStatus);
        return () => {
            throttledApplyFilters.cancel();
        };
    }, [search, selectedCategory, selectedStatus, throttledApplyFilters]);

    useEffect(() => {
        const message = flash?.success ?? flash?.error ?? flash?.message;

        if (!message) return;

        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
        if (flash.message) toast.info(flash.message);
    }, [flash]);

    const handleDeleteClick = (article: Article) => {
        setArticleToDelete(article);
        setIsDeleteDialogOpen(true);
    };

    // --- HANDLER BARU UNTUK EDIT ---
    const handleEditClick = (article: Article) => {
        setArticleToEdit(article);
        setIsEditArticleOpen(true);
    };

    const CreateNewCategoryDialog = () => {
        const { data, setData, post, processing, reset, errors } = useForm<{ name: string; description: string }>({
            name: '',
            description: '',
        });

        const handleNewCategorySubmit = (e: React.FormEvent) => {
            e.preventDefault();
            post(route('editor.categories.store'), {
                onSuccess: () => {
                    // toast.success('Category created successfully!');
                    reset();
                    setIsCreateCategoryOpen(false);
                    // Penting: Reload data categories agar tersedia di AddArticle Dialog
                    router.reload({ only: ['categories'] });
                },
            });
        };

        return (
            <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleNewCategorySubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-[#2e236c]">Create New Category</DialogTitle>
                            <DialogDescription>Enter a new category name.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="category_name" className="text-sm font-bold text-[#2e236c]">
                                    Category Name
                                </label>
                                <input
                                    id="category_name"
                                    type="text"
                                    placeholder="e.g. Technology, Health"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2.5 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="category_description" className="text-sm font-bold text-[#2e236c]">
                                    Category Description
                                </label>
                                <textarea
                                    id="category_description"
                                    placeholder="Lorem ipsum met sup dolor..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="h-52 max-h-60 w-full overflow-y-auto rounded-md border border-[#2e236c]/60 px-4 py-2.5 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                />
                                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing} className="bg-[#2e236c] hover:bg-[#2e236c]/90">
                                {processing ? 'Saving...' : 'Save Category'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    };

    const CreateNewTagDialog = () => {
        const { data, setData, post, processing, reset, errors } = useForm<{ name: string }>({
            name: '',
        });

        const handleNewTagSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            post(route('editor.tags.store'), {
                onSuccess: () => {
                    toast.success('Tag created successfully!');
                    reset();
                    setIsCreateTagOpen(false);
                    // Penting: Reload data tags agar tersedia di AddArticle Dialog
                    router.reload({ only: ['tags'] });
                },
            });
        };

        return (
            <Dialog open={isCreateTagOpen} onOpenChange={setIsCreateTagOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleNewTagSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-[#2e236c]">Create New Tag</DialogTitle>
                            <DialogDescription>Enter a new tag name.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="tag_name" className="text-sm font-bold text-[#2e236c]">
                                    Tag Name
                                </label>
                                <input
                                    id="tag_name"
                                    type="text"
                                    placeholder="e.g. JavaScript, AI, Nature"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2.5 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing} className="bg-[#2e236c] hover:bg-[#2e236c]/90">
                                {processing ? 'Saving...' : 'Save Tag'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    };

    const TagList = ({
        value,
        onChange,
        initialTags,
        maxTags = 5,
    }: {
        value: number[];
        onChange: (value: number[]) => void;
        initialTags: Tag[];
        maxTags?: number;
    }) => {
        const [open, setOpen] = useState(false);
        const [search, setSearch] = useState('');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [allTags, setAllTags] = useState<Tag[]>(initialTags);

        const toggleTag = (tag: Tag) => {
            if (value.includes(tag.id)) {
                onChange(value.filter((id) => id !== tag.id));
                return;
            }

            if (value.length >= maxTags) return;

            onChange([...value, tag.id]);
        };

        const removeTag = (id: number) => {
            onChange(value.filter((tagId) => tagId !== id));
        };

        const filteredTags = allTags.filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()));

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="min-h-[42px] w-full flex-wrap justify-start gap-2 rounded-2xl">
                        {value.length === 0 && <span className="text-muted-foreground">Select tags...</span>}

                        {allTags
                            .filter((tag) => value.includes(tag.id))
                            .map((tag) => (
                                <Badge key={tag.id} className="gap-1">
                                    {tag.name}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeTag(tag.id);
                                        }}
                                    />
                                </Badge>
                            ))}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput placeholder="Search tags..." value={search} onValueChange={setSearch} />

                        <CommandEmpty>No tag found.</CommandEmpty>

                        <CommandGroup className="h-50 overflow-y-auto scroll-auto">
                            {filteredTags.map((tag) => {
                                const selected = value.includes(tag.id);

                                return (
                                    <CommandItem
                                        key={tag.id}
                                        value={tag.name}
                                        onSelect={() => toggleTag(tag)}
                                        disabled={!selected && value.length >= maxTags}
                                    >
                                        <Check className={cn('mr-2 h-4 w-4', selected ? 'opacity-100' : 'opacity-0')} />
                                        {tag.name}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>

                        <div className="px-3 py-2 text-xs text-muted-foreground">
                            {value.length}/{maxTags} selected
                        </div>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    };

    const confirmDelete = () => {
        if (articleToDelete) {
            inertiaDelete(route('editor.articles.destroy', articleToDelete.id), {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setArticleToDelete(null);
                    toast.success(`Article "${articleToDelete.title}" deleted successfully.`);
                    router.reload();
                },
                onError: (errorResponse) => {
                    setIsDeleteDialogOpen(false);
                    const errorMessage = Object.values(errorResponse).flat().join('\n') || 'Failed to delete article.';
                    toast.error(errorMessage);
                },
            });
        }
    };

    const AddArticle = () => {
        // Inisialisasi state form dengan useForm
        const { data, setData, post, processing, errors, reset } = useForm<{
            title: string;
            content: string;
            category_id: string;
            status: 'draft' | 'published';
            tags: number[];
            featured_image: File | null;
        }>({
            title: '',
            content: '',
            category_id: '',
            status: 'draft',
            tags: [],
            featured_image: null,
        });
        const [openCategory, setOpenCategory] = useState(false);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();

            post(route('editor.articles.store'), {
                onSuccess: () => {
                    reset();
                    setIsAddArticleOpen(false);
                    toast.success('Article created successfully!');
                    router.reload({ only: ['articles'] });
                },
                onError: (err) => {
                    console.error('Submission error:', err);
                    toast.error('Failed to create article. Please check the form.');
                },
            });
        };

        // Handler untuk File Upload
        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // Gunakan tipe yang benar
            const file = e.target.files ? e.target.files[0] : null;
            if (file) {
                setData('featured_image', file);
            }
        };

        const handleCategorySelect = (value: string) => {
            setData('category_id', value);
        };

        // const handleTagsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        //     const selectedOptions = Array.from(e.target.selectedOptions);
        //     const values = selectedOptions.map((option) => Number(option.value)).filter((id) => !isNaN(id));
        //     setData('tags', values);
        // };

        return (
            <>
                {/* --- DIALOG: ADD NEW ARTICLE (Tetap Ada) --- */}
                <Dialog open={isAddArticleOpen} onOpenChange={setIsAddArticleOpen}>
                    <DialogTrigger asChild>
                        <div className="mb-8">
                            <button
                                // onClick={() => setIsAddArticleOpen(true)}
                                className="flex cursor-pointer items-center gap-2 rounded-full bg-[#2e236c] px-6 py-2.5 text-sm text-white shadow-sm transition-colors hover:bg-[#2e236c]/90"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Add Article</span>
                            </button>
                        </div>
                    </DialogTrigger>

                    <DialogContent className="max-h-[95vh] overflow-y-auto rounded-xl border-none bg-white p-0 shadow-2xl sm:max-w-xl">
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center justify-between px-6 py-4">
                                <DialogTitle className="text-lg font-bold text-[#2e236c]">Add New Article</DialogTitle>
                            </div>
                            <div className="space-y-5 px-6 pb-6">
                                {/* Article Title */}
                                <div className="space-y-2">
                                    <label htmlFor="title" className="text-sm font-bold text-[#2e236c]">
                                        Article Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        placeholder="Enter Title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2.5 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                    />
                                    {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                                </div>

                                {/* Content / Description (Mapping ke 'content' di Backend) */}
                                <div className="space-y-2">
                                    <label htmlFor="content" className="text-sm font-bold text-[#2e236c]">
                                        Content / Description
                                    </label>
                                    <textarea
                                        id="content"
                                        rows={6}
                                        placeholder="Article Content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="w-full resize-none rounded-2xl border border-[#2e236c]/60 px-4 py-3 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                    />
                                    {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Category Select */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-bold text-[#2e236c]">Category</label>
                                            {/* TOMBOL CREATE CATEGORY BARU */}
                                            <Button
                                                type="button"
                                                onClick={() => setIsCreateCategoryOpen(true)}
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto px-2 py-0.5 text-xs font-bold text-blue-600 hover:bg-blue-50"
                                            >
                                                <Plus className="mr-1 h-3 w-3" /> Create New
                                            </Button>
                                        </div>

                                        {/*  */}
                                        <Popover open={openCategory} onOpenChange={setOpenCategory}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openCategory}
                                                    className="h-[42px] w-full justify-between rounded-full border border-[#2e236c]/60 px-4 text-sm text-[#2e236c]"
                                                >
                                                    {data.category_id
                                                        ? categories.data.find((category) => String(category.id) === data.category_id)?.name
                                                        : 'Select Category'}

                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search category..." />
                                                    <CommandEmpty>No category found.</CommandEmpty>

                                                    <CommandGroup className="h-50 overflow-y-auto scroll-auto">
                                                        {categories.data.map((category) => (
                                                            <CommandItem
                                                                key={category.id}
                                                                value={category.name}
                                                                onSelect={() => handleCategorySelect(String(category.id))}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        'mr-2 h-4 w-4',
                                                                        data.category_id === String(category.id) ? 'opacity-100' : 'opacity-0',
                                                                    )}
                                                                />
                                                                {category.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>

                                        {/*  */}

                                        {/* <Select
                                            onValueChange={handleCategorySelect} // Menggunakan handler sederhana
                                            value={data.category_id}
                                        >
                                            <SelectTrigger className="h-[42px] w-full rounded-full border border-[#2e236c]/60 px-4 py-2 text-sm text-[#2e236c]/60 focus:ring-1 focus:ring-[#2e236c]">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {categories.data.map((category) => (
                                                    <SelectItem key={category.id} value={String(category.id)}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select> */}

                                        {errors.category_id && <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>}
                                    </div>

                                    {/* Status Select */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#2e236c]">Status</label>
                                        <Select onValueChange={(value) => setData('status', value as 'draft' | 'published')} value={data.status}>
                                            <SelectTrigger className="h-[42px] w-full rounded-full border border-[#2e236c]/60 px-4 py-2 text-sm text-[#2e236c]/60 focus:ring-1 focus:ring-[#2e236c]">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status}</p>}
                                    </div>
                                </div>

                                {/* Tags Multi-Select */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="tags" className="text-sm font-bold text-[#2e236c]">
                                            Tags
                                        </label>
                                        {/* TOMBOL CREATE TAG BARU */}
                                        <Button
                                            type="button"
                                            onClick={() => setIsCreateTagOpen(true)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto px-2 py-0.5 text-xs font-bold text-blue-600 hover:bg-blue-50"
                                        >
                                            <Plus className="mr-1 h-3 w-3" /> Create New Tag
                                        </Button>
                                    </div>

                                    <TagList value={data.tags} onChange={(tags) => setData('tags', tags)} initialTags={tags.data} />

                                    {/* <select
                                        multiple
                                        id="tags"
                                        value={data.tags.map(String)}
                                        onChange={handleTagsChange}
                                        className="h-24 w-full rounded-2xl border border-[#2e236c]/60 px-4 py-3 text-sm text-[#2e236c] focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                    >
                                        {tags.data.map((tag) => (
                                            <option key={tag.id} value={String(tag.id)}>
                                                {tag.name}
                                            </option>
                                        ))}
                                    </select> */}

                                    {errors.tags && <p className="mt-1 text-xs text-red-500">{errors.tags}</p>}
                                </div>

                                <br />

                                {/* Upload Featured Image */}
                                <div className="mt-2 flex flex-col items-center rounded-lg border border-[#2e236c]/40 p-6 text-center">
                                    <h4 className="mb-4 text-sm font-bold text-[#2e236c]">Featured Image Upload</h4>

                                    {/* Tampilkan nama file yang dipilih */}
                                    {data.featured_image && (
                                        <p className="mb-2 text-sm font-medium text-[#2e236c]">Selected: {data.featured_image.name}</p>
                                    )}

                                    <div className="relative mb-6 flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#2e236c]/20 bg-[#f8f9fc] px-4 py-8">
                                        <input
                                            type="file"
                                            id="featured_image"
                                            accept=".jpeg,.png,.jpg"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                        />
                                        <div className="pointer-events-none mb-3">
                                            <CloudUpload className="h-10 w-10 text-[#2e236c]/60" />
                                        </div>
                                        <p className="pointer-events-none mb-1 text-xs font-bold text-black">
                                            Drag & drop files or <span className="text-[#2e236c] underline">Browse</span>
                                        </p>
                                        <p className="pointer-events-none text-[10px] text-gray-400">Supported formates: JPEG, PNG, JPG</p>
                                    </div>
                                    {errors.featured_image && <p className="mt-1 text-xs text-red-500">{errors.featured_image}</p>}
                                </div>
                            </div>
                            <div className="flex justify-center pt-2 pb-8">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-full bg-[#2e236c] px-12 py-2.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#2e236c]/90 disabled:bg-[#2e236c]/50"
                                >
                                    {processing ? 'Saving...' : 'Save Article'}
                                </button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Komponen Nested Dialogs */}
                <CreateNewCategoryDialog />
                <CreateNewTagDialog />
            </>
        );
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Article List" />

            <div className="flex h-full flex-col p-4">
                <div className="min-h-[85vh] w-full rounded-xl border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-sidebar">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-[#2e236c] dark:text-white">Article List</h1>
                    </div>

                    <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="relative w-full md:w-1/2">
                            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#2e236c]" />
                            <input
                                type="text"
                                placeholder="Search Articles"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-full border border-[#2e236c]/40 bg-transparent py-2.5 pr-4 pl-12 text-sm text-[#2e236c] placeholder:text-[#2e236c]/60 focus:ring-2 focus:ring-[#2e236c]/20 focus:outline-none"
                            />
                        </div>

                        <div className="w-full md:w-auto">
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="h-11 w-full rounded-full border border-[#2e236c]/40 px-6 text-[#2e236c]/70 md:min-w-[200px]">
                                    <div className="flex items-center gap-3">
                                        <Filter className="h-4 w-4" />
                                        <SelectValue placeholder="All Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    {statuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <AddArticle />

                    {/* <div className="mb-8">
                        <button
                            onClick={() => setIsAddArticleOpen(true)}
                            className="flex cursor-pointer items-center gap-2 rounded-full bg-[#2e236c] px-6 py-2.5 text-sm text-white shadow-sm transition-colors hover:bg-[#2e236c]/90"
                        >
                            <Plus className="h-5 w-5" />
                            <span>Add Article</span>
                        </button>
                    </div> */}

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="text-sm font-bold text-[#2e236c]">
                                    <th className="w-[40%] py-4 pr-4">Article</th>
                                    <th className="px-4 py-4">Author</th>
                                    <th className="px-4 py-4">Date</th>
                                    <th className="px-4 py-4">Status</th>
                                    <th className="py-4 pl-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {articles.data.length > 0 ? (
                                    articles.data.map((article) => (
                                        <tr key={article.id} className="group hover:bg-gray-50/50">
                                            <td className="py-6 pr-4 align-top">
                                                <div className="flex gap-4">
                                                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100">
                                                        {article.featured_image_url ? (
                                                            <img
                                                                src={article.featured_image_url}
                                                                alt={article.title}
                                                                className="h-full w-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.src =
                                                                        'https://placehold.co/600x400/de0a26/transparent?text=Image+Error';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-[#2e236c]/10 text-xs text-[#2e236c]/40">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col justify-start">
                                                        <span className="mb-1 text-[15px] font-bold text-[#2e236c]">{article.title}</span>
                                                        <p className="line-clamp-2 text-xs leading-relaxed font-light text-gray-400">
                                                            {article.excerpt || 'No description available for this article.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-6 align-middle font-medium text-[#2e236c]">{article.author.name}</td>
                                            <td className="px-4 py-6 align-middle font-medium whitespace-nowrap text-[#2e236c]">
                                                {article.published_at
                                                    ? format(new Date(article.published_at), 'MMM, dd yyyy')
                                                    : format(new Date(article.created_at), 'MMM, dd yyyy')}
                                            </td>
                                            <td className="px-4 py-6 align-middle">
                                                <span
                                                    className={`rounded-full px-5 py-1.5 text-xs font-medium text-white capitalize shadow-sm ${
                                                        article.status === 'published'
                                                            ? 'bg-[#32c945]'
                                                            : article.status === 'draft'
                                                              ? 'bg-[#ff5b5b]'
                                                              : 'bg-gray-400'
                                                    }`}
                                                >
                                                    {article.status}
                                                </span>
                                            </td>
                                            <td className="py-6 pl-4 text-right align-middle">
                                                <div className="flex items-center justify-end gap-3">
                                                    {/* TOMBOL PENSIL YANG DIMODIFIKASI UNTUK MEMICU EDIT POPUP */}
                                                    <button
                                                        onClick={() => handleEditClick(article)}
                                                        className="rounded-md border border-[#2e236c] p-1.5 text-[#2e236c] transition-colors hover:bg-[#2e236c] hover:text-white"
                                                    >
                                                        <SquarePen className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(article)}
                                                        className="p-1.5 text-[#2e236c] transition-colors hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-6 w-6" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-400">
                                            No articles found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {articles.last_page > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination>
                                <div className="flex space-x-2">
                                    {articles.links.map((link, index) => {
                                        const params = new URLSearchParams(link.url ? new URL(link.url).search : '');
                                        if (search) params.set('search', search);
                                        else params.delete('search');
                                        if (selectedCategory !== 'all') params.set('category', selectedCategory);
                                        else params.delete('category');
                                        if (selectedStatus !== 'all') params.set('status', selectedStatus);
                                        else params.delete('status');

                                        // FIXED: Menambahkan backticks (`)
                                        const fullHref = `${route('editor.articles.index')}?${params.toString()}`;

                                        return link.url ? (
                                            <Link
                                                key={index}
                                                href={fullHref}
                                                // FIXED: Menambahkan backticks (`)
                                                className={`rounded-md border px-3 py-1 text-sm ${link.active ? 'border-[#2e236c] bg-[#2e236c] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={index}
                                                className="cursor-not-allowed rounded-md border px-3 py-1 text-sm text-gray-300"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>

            {/* --- DIALOG: EDIT ARTICLE (BARU) --- */}
            <Dialog open={isEditArticleOpen} onOpenChange={setIsEditArticleOpen}>
                <DialogContent className="max-h-[95vh] overflow-y-auto rounded-xl border-none bg-white p-0 shadow-2xl sm:max-w-xl">
                    <div className="flex items-center justify-between px-6 py-4">
                        <DialogTitle className="text-lg font-bold text-[#2e236c]">Edit Article</DialogTitle>
                    </div>

                    {articleToEdit && (
                        <div className="space-y-5 px-6 pb-6">
                            {/* Article Title (Pre-filled) */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2e236c]">Article Title</label>
                                <input
                                    type="text"
                                    defaultValue={articleToEdit.title}
                                    className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2.5 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                />
                            </div>

                            {/* Description (Pre-filled) */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#2e236c]">Description</label>
                                <textarea
                                    rows={4}
                                    defaultValue={articleToEdit.excerpt}
                                    className="w-full resize-none rounded-2xl border border-[#2e236c]/60 px-4 py-3 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                />
                            </div>

                            {/* Row: Author & Status (Pre-filled) */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#2e236c]">Author</label>
                                    <input
                                        type="text"
                                        defaultValue={articleToEdit.author.name}
                                        className="w-full rounded-full border border-[#2e236c]/60 px-4 py-2.5 text-sm text-[#2e236c] placeholder:text-[#2e236c]/40 focus:ring-1 focus:ring-[#2e236c] focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#2e236c]">Status</label>
                                    {/* Default Value untuk Select */}
                                    <Select defaultValue={articleToEdit.status}>
                                        <SelectTrigger className="h-[42px] w-full rounded-full border border-[#2e236c]/60 px-4 py-2 text-sm text-[#2e236c]/60 focus:ring-1 focus:ring-[#2e236c]">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Upload Section (Sama persis dengan Add) */}
                            <div className="mt-2 flex flex-col items-center rounded-lg border border-[#2e236c]/40 p-6 text-center">
                                <h4 className="mb-4 text-sm font-bold text-[#2e236c]">Upload</h4>
                                <div className="mb-6 flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#2e236c]/20 bg-[#f8f9fc] px-4 py-8">
                                    <div className="mb-3">
                                        <CloudUpload className="h-10 w-10 text-[#2e236c]/60" />
                                    </div>
                                    <p className="mb-1 text-xs font-bold text-black">
                                        Drag & drop files or <span className="cursor-pointer text-[#2e236c] underline">Browse</span>
                                    </p>
                                    <p className="text-[10px] text-gray-400">Supported formates: JPEG, PNG, JPG</p>
                                </div>

                                {/* Contoh tampilan jika ada file (Dummy) sesuai permintaan gambar */}
                                <div className="mb-6 w-full space-y-4 text-left">
                                    <div>
                                        <p className="mb-1 text-xs text-gray-500">Uploading files</p>
                                        <div className="flex items-center justify-between border-b border-[#2e236c] pb-1">
                                            <span className="text-xs text-gray-700">your-file-here.png</span>
                                            <Trash2 className="h-4 w-4 cursor-pointer text-red-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="mb-1 text-xs text-gray-500">Uploaded</p>
                                        <div className="flex items-center justify-between rounded border border-green-400 bg-white px-2 py-1.5">
                                            <span className="text-xs text-gray-700">image-name-goes-here.png</span>
                                            <div className="rounded-full bg-gray-300 p-0.5">
                                                <X className="h-3 w-3 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full rounded-lg bg-[#2e236c] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#2e236c]/90">
                                    Upload File
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center pt-2 pb-8">
                        <button className="rounded-full bg-[#2e236c] px-12 py-2.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#2e236c]/90">
                            Save
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="rounded-xl bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-[#2e236c]">Are you absolutely sure?</DialogTitle>
                        <DialogDescription className="text-gray-500">
                            This action cannot be undone. This will permanently delete the article{' '}
                            <span className="font-semibold text-[#2e236c]">"{articleToDelete?.title}"</span>.
                        </DialogDescription>
                        {Object.keys(errors).length > 0 && (
                            <div className="mt-2 text-sm text-red-500">
                                {(Object.values(errors) as string[]).map((message, i) => (
                                    <p key={i}>{message}</p>
                                ))}
                            </div>
                        )}
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={processing} className="rounded-full">
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={processing}
                            className="rounded-full bg-red-500 hover:bg-red-600"
                        >
                            {processing ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <hr />

            {/* <CobaNestedDialogue /> */}
        </AppSidebarLayout>
    );
}

// function CobaNestedDialogue() {
//     const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);
//     const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);

//     return (
//         <>
//             {/* Dialog UTAMA */}
//             <Dialog open={isCreateTagOpen} onOpenChange={setIsCreateTagOpen}>
//                 <DialogTrigger asChild>
//                     <Button>Buka Dialog Utama</Button>
//                 </DialogTrigger>

//                 <DialogContent className="h-150">
//                     <DialogHeader>
//                         <DialogTitle>Coba Nested Dialogue</DialogTitle>
//                     </DialogHeader>

//                     <div>Ini Content utama</div>

//                     <DialogFooter>
//                         <Button onClick={() => setIsAddArticleOpen(true)}>Buka Dialog 2</Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>

//             {/* Dialog KEDUA (Nested secara logika, bukan struktur JSX) */}
//             <Dialog open={isAddArticleOpen} onOpenChange={setIsAddArticleOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Coba Nested Dialogue nested 2</DialogTitle>
//                     </DialogHeader>

//                     <div>
//                         <h1>Ini Content</h1>
//                     </div>

//                     <DialogFooter>
//                         <Button onClick={() => setIsAddArticleOpen(false)}>Tutup</Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// }
