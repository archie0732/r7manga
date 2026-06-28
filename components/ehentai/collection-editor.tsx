'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import type { EhentaiCollection } from '@/app/api/favorite/_model/apitype';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { moveCollectionItem } from './collection-utils';

type Props = Readonly<{
  collection: EhentaiCollection;
}>;

export function CollectionEditor({ collection }: Props) {
  const router = useRouter();
  const [name, setName] = useState(collection.name);
  const [items, setItems] = useState(collection.items);
  const [pending, setPending] = useState(false);

  const updateCollection = async (payload: Record<string, unknown>) => {
    setPending(true);

    try {
      const response = await fetch('/api/favorite', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update collection');
      }

      router.refresh();
    }
    finally {
      setPending(false);
    }
  };

  const renameCollection = async () => {
    if (!name.trim()) {
      return;
    }

    await updateCollection({
      type: 'ehentai-collection-rename',
      collectionId: collection.id,
      name,
    });
  };

  const reorderCollection = async (index: number, direction: 'up' | 'down') => {
    const next = moveCollectionItem(items, index, direction);
    setItems(next);

    await updateCollection({
      type: 'ehentai-collection-reorder',
      collectionId: collection.id,
      itemIds: next.map((item) => item.id),
    });
  };

  const removeItem = async (itemId: string) => {
    setItems((current) => current.filter((item) => item.id !== itemId));

    await updateCollection({
      type: 'ehentai-collection-remove-item',
      collectionId: collection.id,
      itemId,
    });
  };

  const deleteCollection = async () => {
    await updateCollection({
      type: 'ehentai-collection-delete',
      collectionId: collection.id,
    });
    router.push('/e/collections');
    router.refresh();
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Collection</CardTitle>
          <CardDescription>Rename the collection, reorder works, or remove entries.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
            <Button onClick={() => void renameCollection()} disabled={pending || !name.trim()}>
              Save Name
            </Button>
            <Button asChild variant="secondary">
              <a href={`/e/collections/${collection.id}/read`}>Read Collection</a>
            </Button>
            <Button variant="destructive" onClick={() => void deleteCollection()} disabled={pending}>
              Delete Collection
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-20 w-16 overflow-hidden rounded-md bg-muted">
                    <Image src={item.thumbnail} alt={item.title} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{`${item.page.toString()} pages | ${item.lang.toUpperCase()}`}</div>
                    <div className="line-clamp-1 text-xs text-muted-foreground">{(item.artists ?? []).join(', ') || 'Unknown artist'}</div>
                    <div className="line-clamp-1 text-xs text-muted-foreground">{(item.parodies ?? []).join(', ') || 'Unknown parody'}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => void reorderCollection(index, 'up')} disabled={pending || index === 0}>
                    Up
                  </Button>
                  <Button variant="secondary" onClick={() => void reorderCollection(index, 'down')} disabled={pending || index === items.length - 1}>
                    Down
                  </Button>
                  <Button variant="destructive" onClick={() => void removeItem(item.id)} disabled={pending}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
