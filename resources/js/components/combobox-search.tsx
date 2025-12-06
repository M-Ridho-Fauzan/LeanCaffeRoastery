import { cn } from '@/lib/utils';

import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface ArticleAttr {
    slug: string;
    name: string;
}

interface ComboboxSearchProps extends React.ComponentPropsWithoutRef<typeof Button> {
    title: string;
    options: ArticleAttr[];
    placeholder?: string;
    // searchPlaceholder?: string;
    emptyMessage?: string;
    allOptionValue?: string;
    value: string;
    onValueChange: (value: string) => void;
}

export function ComboboxSearch({
    title,
    options,
    allOptionValue = '',
    placeholder = 'Select item',
    // searchPlaceholder = 'Search item...',
    emptyMessage = 'No item found.',
    className,
    value,
    onValueChange,
    ...props
}: ComboboxSearchProps) {
    const [open, setOpen] = React.useState(false);
    // const [value, setValue] = React.useState('');
    const titleUpper = title.charAt(0).toUpperCase() + title.slice(1);

    const displayValue = React.useMemo(() => {
        const foundOption = options.find((option) => option.slug === value);

        if (foundOption) {
            return foundOption.name;
        }

        // Jika `value` cocok dengan `allOptionValue`, tampilkan "All Categories"
        // TANPA PEDULI apakah itu ada di `options` atau tidak.
        if (value === allOptionValue) return placeholder;

        // Jika `value` TIDAK ditemukan di `options` DAN BUKAN `allOptionValue`,
        return `Select ${titleUpper}`;
    }, [value, options, placeholder, allOptionValue, titleUpper]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className={cn('w-[200px] justify-between', className)} {...props}>
                    {/* {value ? options.find((item) => item.slug === value)?.name : searchPlaceholder} */}
                    {displayValue}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={placeholder} />
                    <CommandList>
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        <CommandGroup>
                            {allOptionValue !== undefined && !options.some((option) => option.slug === allOptionValue) && (
                                <CommandItem
                                    key={`all-categories-${allOptionValue}`}
                                    value={allOptionValue}
                                    onSelect={() => {
                                        onValueChange(allOptionValue);
                                        setOpen(false);
                                    }}
                                >
                                    <CheckIcon className={cn('mr-2 h-4 w-4', value === allOptionValue ? 'opacity-100' : 'opacity-0')} />
                                    All {titleUpper}
                                </CommandItem>
                            )}
                            {options.map((item) => (
                                <CommandItem
                                    key={item.slug}
                                    value={item.slug}
                                    onSelect={(currentValue) => {
                                        onValueChange(currentValue === value ? '' : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <CheckIcon className={cn('mr-2 h-4 w-4', value === item.slug ? 'opacity-100' : 'opacity-0')} />
                                    {item.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
