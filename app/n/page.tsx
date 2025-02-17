import { PaginationDemo } from '@/components/search/pagination';
import { DoujinSearchResult } from '../api/nhentai/search/route';
import { DoujinCarousel } from '@/components/doujin-carousel';
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { Book } from 'lucide-react';
import Image from 'next/image';

type Props = Readonly<{
  searchParams: Promise<{
    sort?: string;
    page?: string;
  }>;
}>;

export default async function Page({ searchParams }: Props) {
  const search = await searchParams;

  const sort = search.sort ?? 'recent';
  const page = search.page ?? '1';

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/nhentai/search?q=*&sort=${sort}&page=${page}`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Error: ${response.statusText}`);
    return (<div className="flex items-center justify-center"><span>發生錯誤</span></div>);
  }

  const doujin = (await response.json()) as DoujinSearchResult[];

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
          <Button className="ml-5" variant="ghost" asChild>
            <Link href={`/n?page=${page}`}>最近</Link>
          </Button>
          <Button className="ml-5" variant="ghost" asChild>
            <Link href={`/n?page=${page}&sort=popular-today`}>本日</Link>
          </Button>
          <Button className="ml-5" variant="ghost" asChild>
            <Link href={`/n?page=${page}&sort=popular-week`}>這周</Link>
          </Button>
          <Button className="ml-5" variant="ghost" asChild>
            <Link href={`/n?page=${page}&sort=popular`}>所有時間</Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <Book size={40} />
        <span className="text-5xl">nhentai</span>
      </div>
      <DoujinCarousel comic={doujin} website="n" />
      <div>{doujin.length}</div>
      <PaginationDemo url={`/n?sort=${sort}`} nowPage={Number(page) ? Number(page) : 1} doujinCount={doujin.length} />
    </div>
  );
}
