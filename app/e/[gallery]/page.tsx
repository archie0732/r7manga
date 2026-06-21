'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { SiteFavoriteButton } from '@/components/favorite/site-favorite-button';
import { Skeleton } from '@/components/ui/skeleton';

import { EHENTAI_IMAGE_BATCH_SIZE, type EhentaiGalleryDetail } from '@/app/api/ehentai/_model/client';

type Props = Readonly<{
  params: Promise<{
    gallery: string;
  }>;
}>;

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
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Preview Pages</h2>
            <p className="text-sm text-muted-foreground">
              {`${previewImages.length.toString()} / ${gallery.pageLinks.length.toString()} loaded`}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {previewImages.map((image, index) => (
              <div key={`${image}-${index.toString()}`} className="space-y-2">
                <p className="text-sm text-muted-foreground">{`Page ${(index + 1).toString()}`}</p>
                <Image
                  src={image}
                  alt={`preview-${index + 1}`}
                  width={1200}
                  height={1600}
                  className="h-auto w-full rounded border"
                />
              </div>
            ))}
          </div>
          {loadingPreview ? <p className="text-sm text-muted-foreground">Loading preview pages...</p> : null}
          {!loadingPreview && previewImages.length < gallery.pageLinks.length
            ? (
                <Button
                  variant="secondary"
                  onClick={() => void loadPreviewImages(gallery, previewImages.length)}
                >
                  View more
                </Button>
              )
            : null}
        </section>
      </div>
    </main>
  );
}
