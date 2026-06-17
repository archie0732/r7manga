import { DoujinCarousel } from '@/components/doujin-carousel';
import { PaginationDemo } from '@/components/search/pagination';
import { SelectDemo } from '@/components/search/select';
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
    w?: string;
  }>;
}>;

type SearchResult = {
  title: string;
  id: string;
  thumbnail: string;
  banTag: string[];
  lang: 'ja' | 'zh' | 'en';
  page: number;
};

export default async function Page({ searchParams }: Props) {
  const search = await searchParams;

  const q = search.q;
  const tag = search.tag;
  const parody = search.parody;
  const artist = search.artist;
  const character = search.character;
  const website = search.w === 'e' ? 'e' : 'n';
  const sort = search.sort ?? 'recent';
  const page = search.page ?? '1';

  const query = new URLSearchParams({
    ...(q && { q }),
    ...(tag && { tag }),
    ...(parody && { parody }),
    ...(artist && { artist }),
    ...(character && { character }),
    ...(website !== 'n' && { w: website }),
  } as Record<string, string>);

  const apiPath = website === 'e'
    ? `/api/ehentai/search?${query}&page=${page}`
    : `/api/nhentai/search?${query}&sort=${sort}&page=${page}`;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiPath}`);

  if (!response.ok) {
    console.error(`Error: ${response.statusText}`);
    return (<div className="flex items-center justify-center"><span>Search failed.</span></div>);
  }

  const doujin = (await response.json()) as SearchResult[];

  if (doujin.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <span className="mb-6 text-xl">No results found.</span>
        <Image src="/img/1210.png" alt="good" width={100} height={100} />
        <Link href="https://youtu.be/dQw4w9WgXcQ?si=khh7Cnz3zHogopVQ">
          <Button variant="secondary">Try again</Button>
        </Link>
      </div>
    );
  }

  const label = q === '*'
    ? 'All'
    : q ?? artist ?? tag ?? parody ?? character ?? '';

  return (
    <div className="flex flex-col justify-center">
      <div className="flex justify-center">
        <span className="text-center text-xl font-bold">{`Search Result: ${label}`}</span>
      </div>
      <div className="mr-5 flex justify-between">
        {website === 'n'
          ? (
              <div>
                <Button className="ml-5" variant="ghost" asChild>
                  <Link href={`/search?${query}&page=${page}`}>Recent</Link>
                </Button>
                <Button className="ml-5" variant="ghost" asChild>
                  <Link href={`/search?${query}&page=${page}&sort=popular-today`}>Today</Link>
                </Button>
                <Button className="ml-5" variant="ghost" asChild>
                  <Link href={`/search?${query}&page=${page}&sort=popular-week`}>Week</Link>
                </Button>
                <Button className="ml-5" variant="ghost" asChild>
                  <Link href={`/search?${query}&page=${page}&sort=popular`}>All Time</Link>
                </Button>
              </div>
            )
          : <div />}
        <SelectDemo />
      </div>
      <DoujinCarousel comic={doujin} website={website} />
      <PaginationDemo url={`/search?${query}&sort=${sort}`} nowPage={Number(page) ? Number(page) : 1} doujinCount={doujin.length} />
    </div>
  );
}
