'use client';

import type { DoujinSearchResult } from '@/app/api/nhentai/search/route';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HomePageCarousel } from '../homepage-carousel';
import { HomePageLodingCarousel } from './homepage-loding-carousel';

export function NhnentaiHomePage() {
  const [doujin, setDoujin] = useState<DoujinSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchDoujin = async () => {
      const res = await fetch('/api/nhentai/search?q=*&sort=recent');

      if (!res.ok) {
        console.error(res.statusText);
        setError(true);
        return;
      }

      setDoujin((await res.json()) as DoujinSearchResult[]);
      setLoading(false);
    };

    void fetchDoujin();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center">

        <div className="flex flex-col">
          <span>由於 n 網開啟了 couldflare 防護，如果是用 vercel 服務的用戶，我們無法提供您關於該網站的服務，這裡向您致上歉意</span>
          <span>r7manga &copy; 2025 </span>
          <Link
            href="https://nhentai.net"
            target="_blank"
            className={`
              text-blue-500
              hover:underline
            `}
          >
            您可以前往原網站觀賞
          </Link>
        </div>

      </div>
    );
  }

  if (loading) {
    return <HomePageLodingCarousel />;
  }

  return (
    <div>
      <HomePageCarousel doujin={doujin} website="n" />
    </div>
  );
}
