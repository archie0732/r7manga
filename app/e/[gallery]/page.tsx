'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { SiteFavoriteButton } from '@/components/favorite/site-favorite-button';
import { Skeleton } from '@/components/ui/skeleton';

import type { EhentaiGalleryDetail } from '@/app/api/ehentai/_model/client';

type Props = Readonly<{
  params: Promise<{
    gallery: string;
  }>;
}>;

export default function Page({ params }: Props) {
  const [gallery, setGallery] = useState<EhentaiGalleryDetail | null>(null);

  useEffect(() => {
    void (async () => {
      const value = await params;
      const response = await fetch(`/api/ehentai/${value.gallery}`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status.toString()}: ${await response.text()}`);
      }

      setGallery(await response.json() as EhentaiGalleryDetail);
    })();
  }, [params]);

  if (!gallery) {
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

  return (
    <main className="mt-10 flex flex-col items-center">
      <div className="container mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <Image
            src={gallery.thumbnail || '/img/1210.png'}
            width={300}
            height={420}
            alt="cover"
            className="rounded bg-gray-800 object-cover"
          />
          <div className="space-y-3">
            <h1 className="text-2xl font-bold">{gallery.title}</h1>
            {gallery.titleJpn ? <p className="text-muted-foreground">{gallery.titleJpn}</p> : null}
            <p>{`ID: ${gallery.id}`}</p>
            <p>{`Category: ${gallery.category}`}</p>
            <p>{`Language: ${gallery.language}`}</p>
            <p>{`Pages: ${gallery.filecount.toString()}`}</p>
            <div className="flex gap-2">
              <Link href={`/e/${gallery.id}/scroll`}>
                <Button variant="secondary">Read now</Button>
              </Link>
              <SiteFavoriteButton
                website="ehentai"
                doujin={{
                  id: gallery.id,
                  title: gallery.titleJpn || gallery.title,
                  thumbnail: gallery.thumbnail || '/img/1210.png',
                  lang: gallery.language.toLowerCase().includes('japanese')
                    ? 'ja'
                    : gallery.language.toLowerCase().includes('chinese')
                      ? 'zh'
                      : 'en',
                  page: gallery.filecount,
                  source: gallery.url,
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {gallery.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Page Links</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {gallery.pageLinks.slice(0, 40).map((pageLink, index) => (
              <Link
                key={pageLink}
                href={pageLink}
                target="_blank"
                className="truncate rounded border px-3 py-2 text-sm hover:bg-secondary"
              >
                {`Page ${(index + 1).toString()}: ${pageLink}`}
              </Link>
            ))}
          </div>
          {gallery.pageLinks.length > 40
            ? <p className="text-sm text-muted-foreground">{`Showing first 40 of ${gallery.pageLinks.length.toString()} page links.`}</p>
            : null}
        </section>
      </div>
    </main>
  );
}
