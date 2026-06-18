'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

import type { EhentaiGalleryDetail } from '@/app/api/ehentai/_model/client';

type Props = Readonly<{
  params: Promise<{ gallery: string }>;
}>;

export default function Page({ params }: Props) {
  const [gallery, setGallery] = useState<EhentaiGalleryDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const { gallery } = await params;
        const response = await fetch(`/api/ehentai/${gallery}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status.toString()} ${response.statusText}`);
        }

        setGallery(await response.json() as EhentaiGalleryDetail);
      }
      catch (err) {
        console.error(err);
        setError('Failed to load gallery images.');
      }
    })();
  }, [params]);

  if (error) {
    return (
      <div className="mt-10 flex flex-col items-center text-gray-500">
        <span>{error}</span>
        <Link href="/">
          <Button className="mt-5">Back home</Button>
        </Link>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="mt-10 flex justify-center text-gray-500">
        <span>Loading images...</span>
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-col items-center">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">{gallery.title}</h1>
        <p className="text-muted-foreground">{`${gallery.images.length.toString()} pages`}</p>
      </div>

      {gallery.images.map((url, index) => (
        <Image
          key={url}
          src={url}
          title={url}
          alt={`page-${index + 1}`}
          loading="lazy"
          width={1200}
          height={1600}
          className="h-auto w-full max-w-5xl"
        />
      ))}
    </div>
  );
}
