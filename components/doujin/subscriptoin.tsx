'use client';

import { DoujinSearchResult } from '@/app/api/nhentai/search/route';
import { useEffect, useState } from 'react';
import { HomePageCarousel } from '../homepage-carousel';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Badge } from '../ui/badge';

interface ArtistProps {
  artist: string[];
}

type ArtistData = Record<string, DoujinSearchResult[]>;

export function SubScriptions({ artist }: ArtistProps) {
  const [artistDoujin, setArtistDoujin] = useState<ArtistData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (artist.length === 0) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchArtists = async () => {
      try {
        setLoading(true);

        // ✅ 確保請求不會錯誤
        const response = await Promise.allSettled(
          artist.map(async (name) => {
            const res = await fetch(`/api/nhentai/search?artist=${name}`, { signal });
            if (!res.ok) throw new Error(`fetch artist ${name} error`);
            const data = (await res.json()) as DoujinSearchResult[];
            return { name, data };
          }),
        );

        // ✅ 過濾成功的請求
        const successfulResults = response
          .filter((result) => result.status === 'fulfilled')
          .map((result) => (result as PromiseFulfilledResult<{ name: string; data: DoujinSearchResult[] }>).value);

        // ✅ 更新狀態
        const allSubscription: ArtistData = {};
        successfulResults.forEach(({ name, data }) => {
          allSubscription[name] = data;
        });

        setArtistDoujin(allSubscription);
        setLoading(false);
      }
      catch (error) {
        console.error('Error fetching artists:', error);
        setError(true);
        setLoading(false);
      }
    };

    void fetchArtists();

    return () => controller.abort();
  }, [artist]);

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div>發生錯誤</div>;

  return (
    <div>
      {Object.entries(artistDoujin).map(([name, doujin]) => (
        <div className="mt-2 space-y-4" key={name}>
          <div className="flex justify-between">
            <Badge className="rounded-md bg-gray-500">{name}</Badge>
            <Link href={`/search?artist=${name}&w=n`}>
              <Button variant="link">Read more</Button>
            </Link>
          </div>
          <HomePageCarousel doujin={doujin} website="n" />
        </div>
      ))}
    </div>
  );
}
