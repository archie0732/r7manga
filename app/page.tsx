'use client';

import { Heading1 } from '@/components/ui/typography';
import { Flame } from 'lucide-react';
import { HomePageCarousel } from '@/components/homepage-carousel';
import { HomeLoading } from '@/components/home/home-loading';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

import Link from 'next/link';

import type { DoujinSearchResult } from './api/nhentai/search/route';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [doujin, setDoujin] = useState<DoujinSearchResult[]>([]);
  const [wnacg, setWnacg] = useState<DoujinSearchResult[]>([]);

  const [loading, setloading] = useState(false);
  const [error, setError] = useState(false);

  const url = `/api/nhentai/search?q=*&sort=recent`;
  const wurl = `/api/wnacg/`;

  const updateData = async () => {
    setloading(false);
    const response = await fetch(url);
    const wresponse = await fetch(wurl);

    if (!response.ok) {
      setError(true);
      return;
    }
    if (!wresponse.ok) {
      console.error(response.statusText);
      return;
    }
    const raw = await response.json() as DoujinSearchResult[];
    const wraw = await wresponse.json() as DoujinSearchResult[];

    setDoujin(raw);
    setWnacg(wraw);
    setloading(true);
  };

  useEffect(() => {
    void updateData();
  }, []);

  if (!loading && !error) {
    return <HomeLoading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>nhentai fetch error</CardTitle>
            <CardDescription>you can use favorite offline mode or wnacg</CardDescription>
          </CardHeader>
          <CardFooter className="flex items-end justify-between">
            <Link href="/w"><Button>Wnacg</Button></Link>
            <Link href="/favorite"><Button>Favorite</Button></Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <main className="container flex flex-col">
        <div className="flex flex-col">
          <Heading1
            className={`
              relative flex flex-col items-center justify-center gap-8
              md:flex-row
            `}
          >
            <div className="flex items-center gap-2">
              <Flame size={48} />
              <span>今日更新</span>
            </div>
            <div className="md:absolute md:right-0"></div>
          </Heading1>
          <div>
            <div className="m-3 flex flex-col gap-5 p-4">
              <div className="flex justify-between">
                <span className="text-4xl font-bold">nhentai</span>
                <Link href="/n">
                  <Button variant="link">查看更多</Button>
                </Link>
              </div>
              <HomePageCarousel doujin={doujin} website="n" />
              <div className="flex justify-between">
                <span className="text-4xl font-bold">wnacg</span>
                <Link href="/w">
                  <Button variant="link">查看更多</Button>
                </Link>
              </div>
              <HomePageCarousel doujin={wnacg} website="w" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
