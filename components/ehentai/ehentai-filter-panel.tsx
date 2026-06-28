'use client';

import { useMemo, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

type FilterOption = {
  value: string;
  count: number;
};

type Props = Readonly<{
  title: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
}>;

export function EhentaiFilterPanel({ title, options, selected, onToggle }: Props) {
  const [query, setQuery] = useState('');

  const visibleOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return options;
    }

    return options.filter((option) => option.value.toLowerCase().includes(normalized));
  }, [options, query]);

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="space-y-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{`${options.length.toString()} options`}</p>
      </div>
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={`Search ${title.toLowerCase()}`}
      />
      <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
        {visibleOptions.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-3 rounded-md border p-2">
            <Checkbox
              checked={selected.includes(option.value)}
              onCheckedChange={() => onToggle(option.value)}
            />
            <span className="min-w-0 flex-1 truncate text-sm">{option.value}</span>
            <span className="text-xs text-muted-foreground">{option.count.toString()}</span>
          </label>
        ))}
        {visibleOptions.length === 0 ? <div className="text-sm text-muted-foreground">No matching options.</div> : null}
      </div>
    </div>
  );
}
