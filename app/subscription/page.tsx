import { SubArtist } from '@/components/doujin/sub-artist';
import { FavoriteData } from '../api/favorite/_model/apitype';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SubCharacter } from '@/components/doujin/sub-character';

type Props = Readonly<{
  searchParams: Promise<{
    p?: string;
    type?: string;
  }>;
}>;

export default async function Page({ searchParams }: Props) {
  const p = (await searchParams).p ?? '1';
  const type = (await searchParams).type ?? 'artist';

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/yanami`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('fetch yanami api error');
  }

  const data = await res.json() as FavoriteData;

  const total = type === 'artist' ? Math.floor(data.favorite_nhentai.artist.length / 3) : Math.floor(data.favorite_nhentai.character.length / 3);
  const endIndex = Number(p) * 3;
  const startIndex = endIndex - 2;

  return (
    <div className="p-2">
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold">Subscription</h1>
      </div>
      <div className="flex justify-end p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{type}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href="/subscription?type=artist">
                  artist
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/subscription?type=character">
                  character
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {
        type === 'artist'
          ? <SubArtist artist={data.favorite_nhentai.artist.slice(startIndex, endIndex + 1)} />
          : <SubCharacter character={data.favorite_nhentai.character.slice(startIndex, endIndex + 1)} />
      }
      <div className="mt-5 flex justify-center gap-2">
        <Link href={p === '1' ? `/subscription?p=1&type=${type}` : `/subscription?p=${Number(p) - 1}&type=${type}`} aria-disabled={'1' === p}>
          <Button size="icon" variant="outline" disabled={p === '1'}><ChevronLeft /></Button>
        </Link>
        <Link href={p === total.toString() ? `/subscription?p=${total}&type=${type}` : `/subscription?p=${Number(p) + 1}&type=${type}`} aria-disabled={total.toString() === p}>
          <Button size="icon" variant="outline" disabled={p === total.toString()}><ChevronRight /></Button>
        </Link>
      </div>
      <span className="mt-5 flex justify-center">
        {p}
        /
        {total}
      </span>
    </div>
  );
}
