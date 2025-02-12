'use client';

import type { DoujinSearchResult } from '@/app/api/nhentai/search/route';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HomePageCarousel } from '../homepage-carousel';
import { HomePageLodingCarousel } from './homepage-loding-carousel';

export function WnacgHomePage() {
  const [album, setAlbum] = useState<DoujinSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchDoujin = async () => {
      const res = await fetch('/api/wnacg');

      if (!res.ok) {
        console.error(res.statusText);
        setError(true);
        return;
      }

      setAlbum((await res.json()) as DoujinSearchResult[]);
      setLoading(false);
    };

    void fetchDoujin();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center">

        <div className="flex flex-col">
          <span>抓取錯誤，等待管理員修復中</span>
          <span>r7manga &copy; 2025 </span>
          <Link
            href="/https://wnacg.com"
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
      <HomePageCarousel doujin={album} website="w" />
    </div>
  );
}
