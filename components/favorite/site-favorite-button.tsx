'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/hooks/use-toast';

import type { FavoriteWebsite } from '@/app/api/favorite/_model/apitype';

type Props = Readonly<{
  website: Exclude<FavoriteWebsite, 'nhentai'>;
  doujin: {
    id: string;
    title: string;
    thumbnail: string;
    lang: string;
    page: number;
    source?: string;
  };
}>;

export function SiteFavoriteButton({ website, doujin }: Props) {
  const { toast } = useToast();
  const [favorited, setFavorited] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchState = async () => {
      const query = new URLSearchParams({
        website,
        id: doujin.id,
      });

      const response = await fetch(`/api/favorite?${query.toString()}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        setFavorited(false);
        return;
      }

      const data = await response.json() as { favorited?: boolean };
      setFavorited(Boolean(data.favorited));
    };

    void fetchState();

    return () => {
      controller.abort();
    };
  }, [doujin.id, website]);

  const syncFavorite = async (method: 'POST' | 'DELETE') => {
    if (pending) {
      return;
    }

    setPending(true);

    toast({
      title: method === 'POST' ? 'Adding to favorites...' : 'Removing from favorites...',
      description: 'Please wait a moment.',
    });

    const response = await fetch('/api/favorite', {
      method,
      body: JSON.stringify(method === 'POST'
        ? {
            type: 'doujin',
            website,
            doujin,
          }
        : {
            type: 'doujin',
            website,
            id: doujin.id,
          }),
    });

    if (!response.ok) {
      toast({
        title: method === 'POST' ? 'Add failed' : 'Remove failed',
        description: `${website} favorite.json sync failed.`,
        variant: 'destructive',
      });
      setPending(false);
      return;
    }

    setFavorited(method === 'POST');
    setPending(false);

    toast({
      title: method === 'POST' ? 'Added to favorites' : 'Removed from favorites',
      description: method === 'POST' ? `Saved: ${doujin.title}` : `Removed: ${doujin.title}`,
    });
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      className={favorited
        ? `
            bg-amber-500 text-white
            hover:bg-amber-700
          `
        : undefined}
      onClick={() => void syncFavorite(favorited ? 'DELETE' : 'POST')}
      disabled={pending}
      title={favorited ? '移除收藏' : '加入收藏'}
    >
      <Star />
    </Button>
  );
}
