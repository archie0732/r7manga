'use client';

import { DoujinSearchResult } from '@/app/api/nhentai/search/route';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';
import { HomePageCarousel } from '../homepage-carousel';

interface CharacterProps {
  character: string[];
}

type CharacterData = Record<string, DoujinSearchResult[]>;

export function SubCharacter({ character }: CharacterProps) {
  const [characterDoujin, setCharacterDoujin] = useState<CharacterData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (character.length === 0) return;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const response = await Promise.allSettled(
          character.map(async (name) => {
            const res = await fetch(`/api/nhentai/search?character=${name}`, { signal });
            if (!res.ok) throw new Error(`fetch character error ${name}`);
            const data = (await res.json()) as DoujinSearchResult[];
            return { name, data };
          }),
        );

        const successfulResults = response
          .filter((result) => result.status === 'fulfilled')
          .map((result) => (result as PromiseFulfilledResult<{ name: string; data: DoujinSearchResult[] }>).value);

        const allSubscription: CharacterData = {};
        successfulResults.forEach(({ name, data }) => {
          allSubscription[name] = data;
        });

        setCharacterDoujin(allSubscription);
        setLoading(false);
      }
      catch (error) {
        console.error(error);
        setError(true);
      }
    };

    void fetchCharacter();

    return () => controller.abort();
  }, [character]);

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
  if (loading) return (<div className="flex justify-center text-gray-500"><span>Loading .... </span></div>);

  return (
    <div>
      {
        Object.entries(characterDoujin).map(([name, doujin]) => (
          <div className="mt-4 space-y-4" key={name}>
            <div className="flex justify-between">
              <Badge className="round-md bg-gray-500">{name}</Badge>
              <Link href={`/search?character=${name}&w=n`}>
                <Button variant="link">Read More</Button>
              </Link>
            </div>
            <HomePageCarousel doujin={doujin} website="n" />
          </div>
        ))
      }
    </div>
  );
}
