'use client';

import { ChevronDown } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type FilterOption = {
  value: string;
  count: number;
};

type Props = Readonly<{
  title: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}>;

export function EhentaiFilterPanel({ title, options, selected, onToggle, onClear }: Props) {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="space-y-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{`${options.length.toString()} options`}</p>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="truncate">
              {selected.length > 0 ? `${selected.length.toString()} selected` : `Choose ${title.toLowerCase()}`}
            </span>
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 space-y-3 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{title}</span>
            <Button variant="ghost" size="sm" onClick={onClear} disabled={selected.length === 0}>
              Clear
            </Button>
          </div>

          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {options.map((option) => (
              <label key={option.value} className="flex cursor-pointer items-center gap-3 rounded-md border p-2">
                <Checkbox
                  checked={selected.includes(option.value)}
                  onCheckedChange={() => onToggle(option.value)}
                />
                <span className="min-w-0 flex-1 truncate text-sm">{option.value}</span>
                <span className="text-xs text-muted-foreground">{option.count.toString()}</span>
              </label>
            ))}
            {options.length === 0 ? <div className="text-sm text-muted-foreground">No options yet. Metadata is still syncing.</div> : null}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
