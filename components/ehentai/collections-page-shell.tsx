'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { EhentaiCollection, FavoriteDoujinItem } from '@/app/api/favorite/_model/apitype';

import { CollectionList } from './collection-list';
import { EhentaiFilterPanel } from './ehentai-filter-panel';
import { EhentaiFilterResults } from './ehentai-filter-results';
import { EhentaiManagePanel } from './ehentai-manage-panel';
import { EhentaiMetadataHydrator } from './ehentai-metadata-hydrator';
import { buildEhentaiFilterOptions, filterEhentaiFavorites } from './collection-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Props = Readonly<{
  favorites: FavoriteDoujinItem[];
  collections: EhentaiCollection[];
}>;

export function CollectionsPageShell({ favorites, collections }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<'collections' | 'filter' | 'manage'>('collections');
  const [items, setItems] = useState(favorites);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<{ artists: string[]; parodies: string[] }>({
    artists: [],
    parodies: [],
  });

  const options = useMemo(() => buildEhentaiFilterOptions(items), [items]);
  const filtered = useMemo(() => filterEhentaiFavorites(items, filters), [items, filters]);
  const hydrationCandidates = useMemo(() => {
    const map = new Map<string, FavoriteDoujinItem>();

    for (const item of filtered.slice(0, 12)) {
      map.set(item.id, item);
    }

    for (const item of items.filter((favorite) => selectedIds.includes(favorite.id))) {
      map.set(item.id, item);
    }

    return [...map.values()];
  }, [filtered, items, selectedIds]);

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

  const handleHydrated = (id: string, artists: string[], parodies: string[]) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, artists, parodies } : item));
  };

  const handleReadFiltered = () => {
    const ids = (selectedIds.length > 0 ? selectedIds : filtered.map((item) => item.id)).join(',');

    if (!ids) {
      return;
    }

    router.push(`/e/collections/read?ids=${encodeURIComponent(ids)}`);
  };

  return (
    <>
      <EhentaiMetadataHydrator items={hydrationCandidates} onHydrated={handleHydrated} />
      <Tabs value={tab} onValueChange={(value) => setTab(value as 'collections' | 'filter' | 'manage')} className="space-y-4">
        <TabsList>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="filter">Filter</TabsTrigger>
          <TabsTrigger value="manage">Manage</TabsTrigger>
        </TabsList>

        <TabsContent value="collections">
          <CollectionList collections={collections} />
        </TabsContent>

        <TabsContent value="filter" className="space-y-4">
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
            />
            <EhentaiFilterPanel
              title="Parodies"
              options={options.parodies}
              selected={filters.parodies}
              onToggle={(value) => toggleFilter('parodies', value)}
            />
            <EhentaiFilterResults
              favorites={filtered}
              selectedIds={selectedIds}
              onToggle={toggleSelected}
              onSelectAll={() => setSelectedIds(filtered.map((item) => item.id))}
              onClearSelection={() => setSelectedIds([])}
              onRead={handleReadFiltered}
              onSendToManage={() => setTab('manage')}
            />
          </div>
        </TabsContent>

        <TabsContent value="manage">
          <EhentaiManagePanel favorites={items} collections={collections} selectedIds={selectedIds} />
        </TabsContent>
      </Tabs>
    </>
  );
}
