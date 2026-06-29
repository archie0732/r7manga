'use client';

import { useEffect, useMemo, useState } from 'react';

import type { FavoriteDoujinItem } from '@/app/api/favorite/_model/apitype';
import type { EhentaiGalleryDetail } from '@/app/api/ehentai/_model/client';

import { findFavoritesMissingEhentaiMetadata } from './collection-utils';

type Props = Readonly<{
  items: FavoriteDoujinItem[];
  onHydrated: (id: string, artists: string[], parodies: string[]) => void;
}>;

export function EhentaiMetadataHydrator({ items, onHydrated }: Props) {
  const queue = useMemo(() => findFavoritesMissingEhentaiMetadata(items), [items]);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    const next = queue[0];

    if (!next || pendingId) {
      return;
    }

    let cancelled = false;
    setPendingId(next.id);

    void (async () => {
      try {
        const response = await fetch(`/api/ehentai/${next.id}`);

        if (!response.ok) {
          throw new Error('Failed to load gallery detail');
        }

        const detail = await response.json() as EhentaiGalleryDetail;
        const artists = detail.tags
          .filter((tag) => tag.startsWith('artist:'))
          .map((tag) => tag.slice('artist:'.length));
        const parodies = detail.tags
          .filter((tag) => tag.startsWith('parody:'))
          .map((tag) => tag.slice('parody:'.length));

        await fetch('/api/favorite', {
          method: 'POST',
          body: JSON.stringify({
            type: 'ehentai-hydrate-metadata',
            id: next.id,
            artists,
            parodies,
          }),
        });

        if (!cancelled) {
          onHydrated(next.id, artists, parodies);
        }
      }
      catch {
      }
      finally {
        if (!cancelled) {
          setPendingId(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [onHydrated, pendingId, queue]);

  return null;
}
