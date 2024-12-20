'use client';

import { PaginationDemo } from '@/components/search/pagination';
import { SelectDemo } from '@/components/search/select';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DoujinSearchResult } from '../api/nhentai/search/route';
import { DoujinCarousel } from '@/components/doujin-carousel';
import { Button } from '@/components/ui/button';

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
        return;
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
      <PaginationDemo />
    </div>
  );
}
