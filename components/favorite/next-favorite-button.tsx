'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { ensureFavoriteShape } from '@/app/api/favorite/_model/store';
import { Button } from '@/components/ui/button';

import {
  buildWebsiteFavoriteQueue,
  getNextFavoriteItem,
  getWebsiteFavoriteReaderPath,
} from './favorite-utils';

import type { FavoriteData, FavoriteWebsite } from '@/app/api/favorite/_model/apitype';

type WebsiteWithStoredFavorites = Exclude<FavoriteWebsite, 'nhentai'>;

type Props = Readonly<{
  currentId: string;
  website: WebsiteWithStoredFavorites;
}>;

export function NextFavoriteButton({ currentId, website }: Props) {
  const [nextFavorite, setNextFavorite] = useState<{ id: string; title: string } | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch('/api/yanami', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to load favorites: ${response.status.toString()}`);
        }

        const payload = ensureFavoriteShape(await response.json() as FavoriteData);
        const queue = buildWebsiteFavoriteQueue(payload, website);
        const next = getNextFavoriteItem(queue, currentId);

        if (!cancelled) {
          setNextFavorite(next ? { id: next.id, title: next.title } : null);
        }
      }
      catch {
        if (!cancelled) {
          setNextFavorite(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentId, website]);

  if (nextFavorite === undefined) {
    return null;
  }

  if (!nextFavorite) {
    return <span className="text-sm text-muted-foreground">已經是最後一本收藏漫畫</span>;
  }

  return (
    <Link href={getWebsiteFavoriteReaderPath(website, nextFavorite.id)}>
      <Button variant="secondary">{`下一本收藏: ${nextFavorite.title}`}</Button>
    </Link>
  );
}
