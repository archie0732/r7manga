'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NhentaiURL, useAppStore } from '@/stores/app';

const website: { value: NhentaiURL;label: string }[] = [
  {
    value: 'https://i1.nhentai.net/galleries',
    label: 'i1.nhentai.net',
  },
  {
    value: 'https://i2.nhentai.net/galleries',
    label: 'i2.nhentai.net',
  },
  {
    value: 'https://i3.nhentai.net/galleries',
    label: 'i3.nhentai.net',
  },
];

export function NURLCombobox() {
  const [open, setOpen] = React.useState(false);
  const { nhentaiImageURL, setNImageURL } = useAppStore();
  const [value, setValue] = React.useState(nhentaiImageURL);

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {nhentaiImageURL.replace('https://', '').replace('/galleries', '')}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search website..." className="h-9" />
            <CommandList>
              <CommandEmpty>No website found.</CommandEmpty>
              <CommandGroup>
                {website.map((imageURL) => (
                  <CommandItem
                    key={imageURL.value}
                    value={imageURL.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue as NhentaiURL);
                      setOpen(false);
                      setNImageURL(currentValue as NhentaiURL);
                    }}
                  >
                    {imageURL.label}
                    <Check
                      className={cn(
                        'ml-auto',
                        value === imageURL.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
