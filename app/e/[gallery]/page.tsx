'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { EHENTAI_IMAGE_BATCH_SIZE } from '@/app/api/ehentai/_model/client';
import { SiteFavoriteButton } from '@/components/favorite/site-favorite-button';
import { Skeleton } from '@/components/ui/skeleton';

import type { EhentaiGalleryDetail } from '@/app/api/ehentai/_model/client';

type Props = Readonly<{
  params: Promise<{
    gallery: string;
  }>;
}>;

const resolveGalleryLang = (language: string) => {
  const lower = language.toLowerCase();

  if (lower.includes('japanese')) {
    return 'ja';
  }

  if (lower.includes('chinese')) {
    return 'zh';
  }

  return 'en';
};

export default function Page({ params }: Props) {
  const [gallery, setGallery] = useState<EhentaiGalleryDetail | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const loadPreviewImages = async (targetGallery: EhentaiGalleryDetail, start: number) => {
    setLoadingPreview(true);

    try {
      const response = await fetch(`/api/ehentai/${targetGallery.id}/images?start=${start.toString()}&count=${EHENTAI_IMAGE_BATCH_SIZE.toString()}`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status.toString()}: ${await response.text()}`);
      }

      const payload = await response.json() as { images: string[] };
      setPreviewImages((current) => [...current, ...payload.images]);
    }
    finally {
      setLoadingPreview(false);
    }
  };

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

  useEffect(() => {
    if (!gallery || previewImages.length > 0) {
      return;
    }

    void loadPreviewImages(gallery, 0);
  }, [gallery, previewImages.length]);

  if (!gallery) {
    return (
      <main className="mt-10 flex flex-col items-center">
        <div className="container mx-auto flex flex-col gap-8 px-4">
          <div
            className={`
              flex flex-col gap-4
              md:flex-row md:gap-5
            `}
          >
            <Skeleton className="h-[420px] w-[300px] rounded bg-gray-800" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-10 w-full max-w-2xl" />
              <Skeleton className="h-6 w-full max-w-xl" />
              <div className={`
                grid gap-3
                sm:grid-cols-2
              `}
              >
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-40" />
            <div className={`
              grid grid-cols-2 gap-4
              md:grid-cols-4
              lg:grid-cols-6
            `}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="aspect-[3/4] w-full rounded" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="mt-10 flex flex-col items-center">
        <div className="container mx-auto flex flex-col gap-6 px-4">
          <div className="w-fit">
            <div
              className={`
                flex flex-col gap-3
                md:flex-row md:gap-4
              `}
            >
              <Image
                src={gallery.thumbnail || '/img/1210.png'}
                width={300}
                height={420}
                alt="cover"
                className="rounded bg-gray-800 object-cover"
              />

              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <h1 className={`
                    text-2xl font-bold
                    md:text-3xl
                  `}
                  >
                    {gallery.title}
                  </h1>
                  {gallery.titleJpn ? <p className="text-muted-foreground">{gallery.titleJpn}</p> : null}
                </div>

                <div className={`
                  grid gap-3
                  sm:grid-cols-2
                `}
                >
                  <div className="rounded border bg-card p-3">
                    <p className="text-xs text-muted-foreground uppercase">ID</p>
                    <p className="mt-1 font-medium">{gallery.id}</p>
                  </div>
                  <div className="rounded border bg-card p-3">
                    <p className="text-xs text-muted-foreground uppercase">Category</p>
                    <p className="mt-1 font-medium">{gallery.category}</p>
                  </div>
                  <div className="rounded border bg-card p-3">
                    <p className="text-xs text-muted-foreground uppercase">Language</p>
                    <p className="mt-1 font-medium">{gallery.language}</p>
                  </div>
                  <div className="rounded border bg-card p-3">
                    <p className="text-xs text-muted-foreground uppercase">Pages</p>
                    <p className="mt-1 font-medium">{gallery.filecount.toString()}</p>
                  </div>
                </div>

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
                      lang: resolveGalleryLang(gallery.language),
                      page: gallery.filecount,
                      source: gallery.url,
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {gallery.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-secondary px-3 py-1 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <section className="mt-10">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl">Preview Pages:</h2>
                <p className="text-sm text-muted-foreground">
                  {`${previewImages.length.toString()} / ${gallery.pageLinks.length.toString()} loaded`}
                </p>
              </div>

              <div
                className={`
                  mt-4 grid grid-cols-2 gap-4
                  md:grid-cols-4 md:justify-start
                  lg:grid-cols-6
                `}
              >
                {previewImages.map((image, index) => (
                  <Link href={`/e/${gallery.id}/scroll`} key={`${image}-${index.toString()}`}>
                    <Image
                      src={image}
                      width={180}
                      height={240}
                      alt={`preview-${index + 1}`}
                      className={`
                        aspect-[3/4] rounded border object-cover
                        transition-opacity
                        hover:opacity-90
                      `}
                    />
                  </Link>
                ))}
              </div>

              {loadingPreview
                ? (
                    <p className="mt-4 text-sm text-muted-foreground">
                      Loading preview pages...
                    </p>
                  )
                : null}
              {!loadingPreview && previewImages.length < gallery.pageLinks.length
                ? (
                    <div className="flex justify-end">
                      <Button
                        variant="link"
                        onClick={() => void loadPreviewImages(gallery, previewImages.length)}
                      >
                        view More
                      </Button>
                    </div>
                  )
                : null}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
