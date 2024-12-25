'use client';

import { PaginationDemo } from '@/components/search/pagination';
import { SelectDemo } from '@/components/search/select';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DoujinSearchResult } from '../api/nhentai/search/route';
import { DoujinCarousel } from '@/components/doujin-carousel';
import { Button } from '@/components/ui/button';

import Image from 'next/image';
import Link from 'next/link';

const webSite = {
  n: 'nhentai',
  d: 'dlsite',
};

export default function Page() {
  const searchParam = useSearchParams();
  const router = useRouter();
  const q = searchParam.get('q');
  const sort = searchParam.get('sort');
  const w = searchParam.get('w');
  const page = searchParam.get('page');
  const [doujin, setDoujin] = useState<DoujinSearchResult[]>([]);

  const fetchSearch = async (
    website = 'nhentai',
    query = '*',
    s = '',
    p = '1',
  ) => {
    try {
      const response = await fetch(
        `/api/${website}/search?q=${encodeURIComponent(query)}&sort=${s}&page=${p}`,
      );
      if (!response.ok) {
        console.error(`Error: ${response.statusText}`);
        return (<div className="flex items-center justify-center"><span>發生錯誤</span></div>);
      }
      const data = (await response.json()) as DoujinSearchResult[];
      setDoujin(data);
    }
    catch (error) {
      console.error('Failed to fetch search results:', error);
    }
  };
  const updateSort = (newSort: string) => {
    const params = new URLSearchParams(searchParam.toString());
    params.set('sort', newSort);
    router.push(`/search?${params.toString()}`);
  };

  useEffect(() => {
    if (q) {
      const website = webSite[w as keyof typeof webSite] || 'nhentai';
      void fetchSearch(website, q, sort ?? '', page ?? '1');
    }
  }, [q, w, sort, page]);

  if (doujin.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <span className="mb-6 text-xl">沒有結果</span>
        <Image src="/img/1210.png" alt="good" width={100} height={100} />
        <Link href="https://youtu.be/dQw4w9WgXcQ?si=khh7Cnz3zHogopVQ">
          <Button variant="secondary">查看更多</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center">
      <div className="mr-5 flex justify-between">
        <div>
          <Button className="ml-5" variant="ghost" onClick={() => { updateSort('recent'); }}>最近</Button>
          <Button className="ml-5" variant="ghost" onClick={() => { updateSort('popular-today'); }}>本日</Button>
          <Button className="ml-5" variant="ghost" onClick={() => { updateSort('popular-week'); }}>這周</Button>
          <Button className="ml-5" variant="ghost" onClick={() => { updateSort('popular'); }}>所有時間</Button>
        </div>
        <SelectDemo />
      </div>
      <DoujinCarousel comic={doujin} />
      <PaginationDemo url={`/search?q=${q ?? '*'}&w=${w ?? 'n'}&sort=${sort ?? ''}`} nowPage={Number(page) ? Number(page) : 1} />
    </div>
  );
}
