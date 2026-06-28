'use client';

import Image from 'next/image';

import type { FavoriteDoujinItem } from '@/app/api/favorite/_model/apitype';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

type Props = Readonly<{
  favorites: FavoriteDoujinItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onRead: () => void;
  onSendToManage: () => void;
}>;

export function EhentaiFilterResults({
  favorites,
  selectedIds,
  onToggle,
  onSelectAll,
  onClearSelection,
  onRead,
  onSendToManage,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={onSelectAll} disabled={favorites.length === 0}>
          Select all filtered
        </Button>
        <Button variant="secondary" onClick={onClearSelection} disabled={selectedIds.length === 0}>
          Clear selection
        </Button>
        <Button onClick={onRead} disabled={favorites.length === 0}>
          Read filtered
        </Button>
        <Button variant="outline" onClick={onSendToManage} disabled={selectedIds.length === 0}>
          Send to Manage
        </Button>
        <span className="text-sm text-muted-foreground">
          {`${favorites.length.toString()} results | ${selectedIds.length.toString()} selected`}
        </span>
      </div>

      {favorites.length === 0
        ? <div className="rounded-lg border p-6 text-sm text-muted-foreground">No works match the current filters.</div>
        : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
              {favorites.map((favorite) => (
                <label key={favorite.id} className="space-y-3 rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <Checkbox
                      checked={selectedIds.includes(favorite.id)}
                      onCheckedChange={() => onToggle(favorite.id)}
                    />
                    <span className="text-xs text-muted-foreground">{`${favorite.page.toString()}p`}</span>
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
                    <Image
                      src={favorite.thumbnail}
                      alt={favorite.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-2 text-sm font-medium">{favorite.title}</p>
                    <p className="text-xs text-muted-foreground">{favorite.lang.toUpperCase()}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{(favorite.artists ?? []).join(', ') || 'Unknown artist'}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{(favorite.parodies ?? []).join(', ') || 'Unknown parody'}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
    </div>
  );
}
