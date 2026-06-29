'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { FavoriteDoujinItem } from '@/app/api/favorite/_model/apitype';

import { buildEhentaiFilterOptions, filterEhentaiFavorites } from '@/components/ehentai/collection-utils';
import { EhentaiFilterPanel } from '@/components/ehentai/ehentai-filter-panel';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

type Props = Readonly<{
  favorites: FavoriteDoujinItem[];
}>;

export function EhentaiFavoritesPanel({ favorites }: Props) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ artists: string[]; parodies: string[] }>({
    artists: [],
    parodies: [],
  });
  const [pending, setPending] = useState(false);

  const options = useMemo(() => buildEhentaiFilterOptions(favorites), [favorites]);
  const filtered = useMemo(() => filterEhentaiFavorites(favorites, filters), [favorites, filters]);

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]);
  };

  const toggleFilter = (key: 'artists' | 'parodies', value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  };

  const removeSelected = async () => {
    if (selectedIds.length === 0 || pending) {
      return;
    }

    setPending(true);

    try {
      const response = await fetch('/api/favorite', {
        method: 'DELETE',
        body: JSON.stringify({
          type: 'bulk-doujin',
          website: 'ehentai',
          ids: selectedIds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorites');
      }

      setSelectedIds([]);
      router.refresh();
    }
    finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
        {filters.artists.map((artist) => <span key={`artist-${artist}`} className="rounded-full border px-3 py-1">{artist}</span>)}
        {filters.parodies.map((parody) => <span key={`parody-${parody}`} className="rounded-full border px-3 py-1">{parody}</span>)}
        {filters.artists.length === 0 && filters.parodies.length === 0 ? <span>No active filters.</span> : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-[280px_280px_1fr]">
        <EhentaiFilterPanel
          title="Artists"
          options={options.artists}
          selected={filters.artists}
          onToggle={(value) => toggleFilter('artists', value)}
          onClear={() => setFilters((current) => ({ ...current, artists: [] }))}
        />
        <EhentaiFilterPanel
          title="Parodies"
          options={options.parodies}
          selected={filters.parodies}
          onToggle={(value) => toggleFilter('parodies', value)}
          onClear={() => setFilters((current) => ({ ...current, parodies: [] }))}
        />

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setSelectedIds(filtered.map((item) => item.id))}
              disabled={filtered.length === 0}
            >
              Select all filtered
            </Button>
            <Button
              variant="secondary"
              onClick={() => setSelectedIds([])}
              disabled={selectedIds.length === 0}
            >
              Clear selection
            </Button>
            <Button
              variant="destructive"
              onClick={() => void removeSelected()}
              disabled={selectedIds.length === 0 || pending}
            >
              Remove selected
            </Button>
            <span className="text-sm text-muted-foreground">
              {`${filtered.length.toString()} results | ${selectedIds.length.toString()} selected`}
            </span>
          </div>

          {filtered.length === 0
            ? <div className="rounded-lg border p-6 text-sm text-muted-foreground">No ehentai favorites match the current filters.</div>
            : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {filtered.map((favorite) => (
                    <div key={favorite.id} className="space-y-3 rounded-lg border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <Checkbox
                          checked={selectedIds.includes(favorite.id)}
                          onCheckedChange={() => toggleSelected(favorite.id)}
                        />
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/e/${favorite.id}`}>Open</Link>
                        </Button>
                      </div>
                      <Link href={`/e/${favorite.id}`} className="block space-y-3">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
                          <Image
                            src={favorite.thumbnail}
                            alt={favorite.title}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="line-clamp-2 text-sm font-medium">{favorite.title}</p>
                          <p className="text-xs text-muted-foreground">{`${favorite.lang.toUpperCase()} | ${favorite.page.toString()}p`}</p>
                          <p className="line-clamp-2 text-xs text-muted-foreground">{(favorite.artists ?? []).join(', ') || 'Unknown artist'}</p>
                          <p className="line-clamp-2 text-xs text-muted-foreground">{(favorite.parodies ?? []).join(', ') || 'Unknown parody'}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
        </div>
      </div>
    </div>
  );
}
