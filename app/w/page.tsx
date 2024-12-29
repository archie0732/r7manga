import { PaginationDemo } from '@/components/search/pagination';
import { DoujinSearchResult } from '../api/nhentai/search/route';
import { DoujinCarousel } from '@/components/doujin-carousel';
import { Button } from '@/components/ui/button';

import Image from 'next/image';
import Link from 'next/link';
import { PenTool } from 'lucide-react';

type Props = Readonly<{
  searchParams: Promise<{
    sort?: string;
    page?: string;
  }>;
}>;

export default async function Page({ searchParams }: Props) {
  const search = await searchParams;

  const page = search.page ?? '1';

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/wnacg?page=${page}`;
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
      <div className="flex items-center justify-center">
        <PenTool size={45} />
        <span className="text-5xl">Wnacg</span>
      </div>
      <DoujinCarousel comic={doujin} website="w" />
      <PaginationDemo url="/w?" nowPage={Number(page) ? Number(page) : 1} />
    </div>
  );
}
