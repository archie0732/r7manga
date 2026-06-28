'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import type { EhentaiCollection, FavoriteDoujinItem } from '@/app/api/favorite/_model/apitype';

import { buildSelectedCollectionItems } from './collection-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = Readonly<{
  favorites: FavoriteDoujinItem[];
  collections: EhentaiCollection[];
  selectedIds: string[];
}>;

export function EhentaiManagePanel({ favorites, collections, selectedIds }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<'create' | 'append'>('create');
  const [name, setName] = useState('');
  const [collectionId, setCollectionId] = useState(collections[0]?.id ?? '');
  const [pending, setPending] = useState(false);

  const selectedItems = useMemo(
    () => buildSelectedCollectionItems(favorites, selectedIds),
    [favorites, selectedIds],
  );

  const submit = async () => {
    if (selectedItems.length === 0 || pending) {
      return;
    }

    if (mode === 'create' && !name.trim()) {
      return;
    }

    if (mode === 'append' && !collectionId) {
      return;
    }

    setPending(true);

    try {
      const payload = mode === 'create'
        ? { type: 'ehentai-collection-create', name, itemIds: selectedItems.map((item) => item.id) }
        : { type: 'ehentai-collection-append', collectionId, itemIds: selectedItems.map((item) => item.id) };

      const response = await fetch('/api/favorite', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save collection changes');
      }

      if (mode === 'create') {
        setName('');
      }

      router.refresh();
    }
    finally {
      setPending(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Selected Works</CardTitle>
          <CardDescription>{`${selectedItems.length.toString()} works ready for collection management`}</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedItems.length === 0
            ? <div className="text-sm text-muted-foreground">Select works from the Filter tab first.</div>
            : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="space-y-2 rounded-lg border p-3">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
                        <Image src={item.thumbnail} alt={item.title} fill sizes="20vw" className="object-cover" />
                      </div>
                      <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{(item.artists ?? []).join(', ') || 'Unknown artist'}</p>
                    </div>
                  ))}
                </div>
              )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Collection Target</CardTitle>
          <CardDescription>Create a new collection or append the selection into an existing one.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button variant={mode === 'create' ? 'default' : 'secondary'} onClick={() => setMode('create')}>
              Create new
            </Button>
            <Button variant={mode === 'append' ? 'default' : 'secondary'} onClick={() => setMode('append')}>
              Add to existing
            </Button>
          </div>

          {mode === 'create'
            ? (
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Collection name"
                />
              )
            : (
                <Select value={collectionId} onValueChange={setCollectionId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

          <Button
            className="w-full"
            onClick={() => void submit()}
            disabled={pending || selectedItems.length === 0 || (mode === 'append' && collections.length === 0)}
          >
            {mode === 'create' ? 'Create collection' : 'Add selected'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
