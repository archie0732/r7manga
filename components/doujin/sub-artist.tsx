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

export function SubArtist({ artist }: ArtistProps) {
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

        const response = await Promise.allSettled(
          artist.map(async (name) => {
            const res = await fetch(`/api/nhentai/search?artist=${name}`, { signal });
            if (!res.ok) throw new Error(`fetch artist ${name} error`);
            const data = (await res.json()) as DoujinSearchResult[];
            return { name, data };
          }),
        );

        const successfulResults = response
          .filter((result) => result.status === 'fulfilled')
          .map((result) => (result as PromiseFulfilledResult<{ name: string; data: DoujinSearchResult[] }>).value);

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

  if (error) return (
    <div className="flex justify-center">
      <span className="text-gray-500">由於n網的cf防護，使用vercel用戶暫時無法使用，而使用本地的用戶請去取得token。</span>
      <Link
        href="/setting"
        className={`
          text-blue-500
          hover:underline
        `}
      >
        前往設定
      </Link>
    </div>
  );
  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      {Object.entries(artistDoujin).map(([name, doujin]) => (
        <div className="mt-2 space-y-4" key={name}>
          <div className="flex justify-between">
            <Badge className="rounded-md bg-gray-500">{name}</Badge>
            <Link href={`/search?artist=${name}&w=n`}>
              <Button variant="link">Read More</Button>
            </Link>
          </div>
          <HomePageCarousel doujin={doujin} website="n" />
        </div>
      ))}
    </div>
  );
}
