'use client';

import { BookOpenText, EllipsisVertical, Languages, Library, Pen, Tag, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import { TagedDemo } from '@/components/taged_button';
import { Button } from '@/components/ui/button';
import { SiteFavoriteButton } from '@/components/favorite/site-favorite-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/stores/app';

import Image from 'next/image';
import Link from 'next/link';

import type { HentaipawDoujin } from '@/app/api/hentaipaw/[doujin]/route';

type Props = Readonly<{
  params: Promise<{
    doujin: string;
  }>;
}>;

export default function Page({ params }: Props) {
  const [doujin, setDoujin] = useState<HentaipawDoujin | null>(null);
  const [readMore, setReadMore] = useState(false);
  const { protect, protectImage } = useAppStore();

  useEffect(() => {
    void (async () => {
      const id = (await params).doujin;
      const response = await fetch(`/api/hentaipaw/${id}`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status.toString()}: ${await response.text()}`);
      }

      setDoujin(await response.json() as HentaipawDoujin);
    })();
  }, [params]);

  if (!doujin) {
    return (
      <div className="ml-20">
        <div className="flex">
          <Skeleton className="h-[400px] w-[300px]" />
          <div className="ml-5 gap-3">
            <Skeleton className="mt-2 h-[30px] w-[600px]" />
            <Skeleton className="mt-2 h-[30px] w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  const previewLimit = readMore ? 24 : 12;
  const previewImages = doujin.thumbnails.slice(0, previewLimit);

  return (
    <main>
      <div className="mt-10 flex flex-col items-center">
        <div className="container mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <Image
              src={protect ? protectImage : doujin.cover}
              width={300}
              height={420}
              alt="cover"
              className="rounded bg-gray-800 object-cover"
            />
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl font-bold">{doujin.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpenText size={18} />
                <span>{doujin.pages.length}</span>
                <Languages size={18} />
                <span>{doujin.languageLabel}</span>
                <Library size={18} />
                <span>{doujin.category || 'Unknown'}</span>
              </div>
              <TagedDemo tag={doujin.artists} icon={<Pen size={18} />} label="Artist" />
              <TagedDemo tag={doujin.groups} icon={<Users size={18} />} label="Group" />
              <TagedDemo tag={doujin.parody} icon={<Library size={18} />} label="Parody" />
              <TagedDemo tag={doujin.tags} icon={<Tag size={18} />} label="Tags" />
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" asChild>
                  <Link href={`/p/read/${doujin.id}`}>Read now</Link>
                </Button>
                <SiteFavoriteButton
                  website="hentaipaw"
                  doujin={{
                    id: doujin.id,
                    title: doujin.title,
                    thumbnail: doujin.cover,
                    lang: doujin.lang,
                    page: doujin.pages.length,
                    source: `https://zh.hentaipaw.com/articles/${doujin.id}`,
                  }}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" title="更多功能">
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`https://zh.hentaipaw.com/articles/${doujin.id}`} target="_blank">Open source</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl">Preview</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-6">
              {previewImages.map((url, i) => (
                <Link href={`/p/read/${doujin.id}`} key={i}>
                  <Image
                    src={protect ? protectImage : url}
                    width={180}
                    height={240}
                    alt={`preview-${i.toString()}`}
                    className="rounded bg-gray-800 object-cover"
                  />
                </Link>
              ))}
            </div>
            {!readMore && doujin.thumbnails.length > 12
              ? (
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => setReadMore(true)} variant="link">View more</Button>
                  </div>
                )
              : null}
          </div>
        </div>
      </div>
    </main>
  );
}
