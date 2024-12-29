'use client';

import { DoujinSearchResult } from '@/app/api/nhentai/search/route';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DoujinCarousel } from '@/components/doujin-carousel';

interface RelateProp {
  params: Promise<{ doujin: string }>;
}

export default function Page({ params }: RelateProp) {
  const router = useRouter();
  const [doujin, setDoujin] = useState<DoujinSearchResult[] | null>(null);
  const [doujinId, setDoujinId] = useState<string>('11111');

  const fetchAPI = async () => {
    const id = (await params).doujin;
    const res = await fetch(`/api/nhentai/${id}/related/`);
    if (!res.ok) return;
    const data = await res.json() as DoujinSearchResult[];
    setDoujin(data);
    setDoujinId(id);
  };

  useEffect(() => {
    void fetchAPI();
  }, []);

  if (!doujin) {
    return (
      <div className="flex flex-col items-center justify-center gap-3">
        <h1 className="mb-15 text-4xl">相關漫畫</h1>
        <div className="flex justify-center gap-3">
        </div>
      </div>
    );
  }

  if (doujin.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <span className="mb-6 text-xl">沒有結果</span>
        <img src="/img/1210.png" alt="good" width={400} height={400} />
        <Link href="https://youtu.be/dQw4w9WgXcQ?si=khh7Cnz3zHogopVQ">
          <Button variant="secondary">查看更多</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <h1 className="mb-15 text-4xl">相關漫畫</h1>
      <DoujinCarousel comic={doujin} website="n" />
      <div className="flex gap-4">
        <Button onClick={() => { router.push(`/n/${doujinId}/`); }}>回預覽畫面</Button>
        <Button onClick={() => { router.push('/'); }}>回首頁</Button>
      </div>
    </div>
  );
}
