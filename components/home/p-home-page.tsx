'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import type { HentaipawSearchRouteResult } from '@/app/api/hentaipaw/search/route';

import { HomePageCarousel } from '../homepage-carousel';
import { HomePageLodingCarousel } from './homepage-loding-carousel';

export function HentaipawHomePage() {
  const [doujin, setDoujin] = useState<HentaipawSearchRouteResult>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchDoujin = async () => {
      const res = await fetch('/api/hentaipaw/search?page=1');

      if (!res.ok) {
        console.error(res.statusText);
        setError(true);
        return;
      }

      setDoujin(await res.json() as HentaipawSearchRouteResult);
      setLoading(false);
    };

    void fetchDoujin();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center">
        <div className="flex flex-col">
          <span>Failed to load hentaipaw homepage.</span>
          <span>r7manga &copy; 2025 </span>
          <Link
            href="https://zh.hentaipaw.com"
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            Open source website
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <HomePageLodingCarousel />;
  }

  return <HomePageCarousel doujin={doujin} website="p" />;
}
