import { BookHeart } from 'lucide-react';

import { DoujinCarousel } from '@/components/doujin-carousel';
import { PaginationDemo } from '@/components/search/pagination';
import { Button } from '@/components/ui/button';

import Image from 'next/image';
import Link from 'next/link';

import type { HentaipawSearchRouteResult } from '../api/hentaipaw/search/route';

type Props = Readonly<{
  searchParams: Promise<{
    q?: string;
    tag?: string;
    tagId?: string;
    artist?: string;
    artistId?: string;
    group?: string;
    groupId?: string;
    parody?: string;
    parodyId?: string;
    sort?: string;
    page?: string;
  }>;
}>;

export default async function Page({ searchParams }: Props) {
  const search = await searchParams;
  const sort = search.sort === 'popular' ? 'popular' : 'recent';
  const page = search.page ?? '1';
  const isHomeMode = !search.q && !search.tagId && !search.artistId && !search.groupId && !search.parodyId;

  const query = new URLSearchParams({
    ...(search.q && { q: search.q }),
    ...(search.tag && { tag: search.tag }),
    ...(search.tagId && { tagId: search.tagId }),
    ...(search.artist && { artist: search.artist }),
    ...(search.artistId && { artistId: search.artistId }),
    ...(search.group && { group: search.group }),
    ...(search.groupId && { groupId: search.groupId }),
    ...(search.parody && { parody: search.parody }),
    ...(search.parodyId && { parodyId: search.parodyId }),
    sort,
    page,
  });

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hentaipaw/search?${query.toString()}`);

  if (!response.ok) {
    console.error(`Error: ${response.statusText}`);
    return (<div className="flex items-center justify-center"><span>Search failed.</span></div>);
  }

  const doujin = (await response.json()) as HentaipawSearchRouteResult;

  if (doujin.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <span className="mb-6 text-xl">No results found.</span>
        <Image src="/img/1210.png" alt="good" width={100} height={100} />
      </div>
    );
  }

  const label = isHomeMode ? 'Home' : (search.q ?? search.artist ?? search.group ?? search.parody ?? search.tag ?? 'Latest');
  const pageQuery = new URLSearchParams({
    ...(search.q && { q: search.q }),
    ...(search.tag && { tag: search.tag }),
    ...(search.tagId && { tagId: search.tagId }),
    ...(search.artist && { artist: search.artist }),
    ...(search.artistId && { artistId: search.artistId }),
    ...(search.group && { group: search.group }),
    ...(search.groupId && { groupId: search.groupId }),
    ...(search.parody && { parody: search.parody }),
    ...(search.parodyId && { parodyId: search.parodyId }),
    sort,
  });

  return (
    <div className="flex flex-col justify-center">
      <div className="mr-5 flex justify-between">
        <div>
          <Button className="ml-5" variant="ghost" asChild>
            <Link href={`/p?${pageQuery.toString().replace(/(^|&)sort=popular(&|$)/, '$1').replace(/^&|&$/g, '')}`}>Recent</Link>
          </Button>
          <Button className="ml-5" variant="ghost" asChild>
            <Link href={`/p?${new URLSearchParams({ ...Object.fromEntries(pageQuery), sort: 'popular' }).toString()}`}>Popular</Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <BookHeart size={40} />
          <span className="text-5xl">hentaipaw</span>
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <DoujinCarousel comic={doujin} website="p" />
      <PaginationDemo url={`/p?${pageQuery.toString()}`} nowPage={Number(page) ? Number(page) : 1} doujinCount={doujin.length} />
    </div>
  );
}
