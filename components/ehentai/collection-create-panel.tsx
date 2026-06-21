'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { EhentaiCollection, FavoriteDoujinItem } from '@/app/api/favorite/_model/apitype';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { buildSelectedCollectionItems } from './collection-utils';

type Props = Readonly<{
  favorites: FavoriteDoujinItem[];
  collections: EhentaiCollection[];
}>;

export function CollectionCreatePanel({ favorites, collections }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pending, setPending] = useState(false);

  const selectedItems = useMemo(
    () => buildSelectedCollectionItems(favorites, selectedIds),
    [favorites, selectedIds],
  );

  const toggleSelection = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]);
  };

  const createCollection = async () => {
    if (!name.trim() || selectedIds.length === 0 || pending) {
      return;
    }

    setPending(true);

    try {
      const response = await fetch('/api/favorite', {
        method: 'POST',
        body: JSON.stringify({
          type: 'ehentai-collection-create',
          name,
          itemIds: selectedIds,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create collection');
      }

      setName('');
      setSelectedIds([]);
      router.refresh();
    }
    finally {
      setPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Collection</CardTitle>
        <CardDescription>
          Select saved e-hentai favorites, give the set a name, and store it in favorite.json.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Collection name"
          />
          <Button onClick={() => void createCollection()} disabled={pending || !name.trim() || selectedIds.length === 0}>
            Create
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {`${selectedItems.length.toString()} selected`}
          {collections.length > 0 ? ` • ${collections.length.toString()} collections saved` : ''}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((favorite) => {
            const checked = selectedIds.includes(favorite.id);

            return (
              <label
                key={favorite.id}
                className={`
                  flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors
                  ${checked ? 'border-primary bg-primary/5' : 'border-border'}
                `}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSelection(favorite.id)}
                  className="mt-1"
                />
                <div className="min-w-0">
                  <div className="truncate font-medium">{favorite.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {`${favorite.page.toString()} pages • ${favorite.lang.toUpperCase()}`}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
