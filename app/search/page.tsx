import { PaginationDemo } from '@/components/search/pagination';
import { SelectDemo } from '@/components/search/select';
import { DoujinSearchResult } from '../api/nhentai/search/route';
import { DoujinCarousel } from '@/components/doujin-carousel';
import { Button } from '@/components/ui/button';

import Image from 'next/image';
import Link from 'next/link';

type Props = Readonly<{
  searchParams: Promise<{
    q?: string;
    tag?: string;
    parody?: string;
    artist?: string;
    character?: string;
    sort?: string;
    page?: string;
  }>;
}>;

export default async function Page({ searchParams }: Props) {
  const search = await searchParams;

  const q = search.q;
  const tag = search.tag;
  const parody = search.parody;
  const artist = search.artist;
  const character = search.character;

  const sort = search.sort ?? 'recent';
  const page = search.page ?? '1';

  const query = new URLSearchParams({
    ...(q && { q }),
    ...(tag && { tag }),
    ...(parody && { parody }),
    ...(artist && { artist }),
    ...(character && { character }),
  } as Record<string, string>);

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/nhentai/search?${query}&sort=${sort}&page=${page}`;
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
            <Link href={`/search?${query}&page=${page}`}>最近</Link>
          </Button>
          <Button className="ml-5" variant="ghost" asChild>
            <Link href={`/search?${query}&page=${page}&sort=popular-today`}>本日</Link>
          </Button>
          <Button className="ml-5" variant="ghost" asChild>
            <Link href={`/search?${query}&page=${page}&sort=popular-week`}>這周</Link>
          </Button>
          <Button className="ml-5" variant="ghost" asChild>
            <Link href={`/search?${query}&page=${page}&sort=popular`}>所有時間</Link>
          </Button>
        </div>
        <SelectDemo />
      </div>
      <DoujinCarousel comic={doujin} />
      {/* TODO: fix pagination */}
      <PaginationDemo url={`/search?${query}&sort=${sort}`} nowPage={Number(page) ? Number(page) : 1} />
    </div>
  );
}
