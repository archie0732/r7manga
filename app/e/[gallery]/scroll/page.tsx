'use client';

import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

import { EHENTAI_IMAGE_BATCH_SIZE, type EhentaiGalleryDetail } from '@/app/api/ehentai/_model/client';
import { shouldAutoLoadEhentaiBatch } from '@/components/ehentai/ehentai-reader-utils';

type Props = Readonly<{
  params: Promise<{ gallery: string }>;
}>;

export default function Page({ params }: Props) {
  const [gallery, setGallery] = useState<EhentaiGalleryDetail | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreImagesRef = useRef<((targetGallery: EhentaiGalleryDetail, start: number) => Promise<void>) | null>(null);

  const loadMoreImages = async (targetGallery: EhentaiGalleryDetail, start: number) => {
    setLoadingMore(true);

    try {
      const response = await fetch(`/api/ehentai/${targetGallery.id}/images?start=${start.toString()}&count=${EHENTAI_IMAGE_BATCH_SIZE.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch image batch: ${response.status.toString()} ${response.statusText}`);
      }

      const batch = await response.json() as { images: string[] };
      setImages((current) => [...current, ...batch.images]);
    }
    catch (err) {
      console.error(err);
      setError('Failed to load gallery images.');
    }
    finally {
      setLoadingMore(false);
    }
  };

  loadMoreImagesRef.current = loadMoreImages;

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

  useEffect(() => {
    if (!gallery || images.length > 0) {
      return;
    }

    void loadMoreImages(gallery, 0);
  }, [gallery, images.length]);

  const hasMore = gallery ? images.length < gallery.pageLinks.length : false;

  useEffect(() => {
    const node = loadMoreTriggerRef.current;

    if (!node || !gallery) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      if (shouldAutoLoadEhentaiBatch({
        hasMore,
        isIntersecting: entry.isIntersecting,
        pending: loadingMore,
      })) {
        void loadMoreImagesRef.current?.(gallery, images.length);
      }
    }, {
      rootMargin: '600px 0px',
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [gallery, hasMore, images.length, loadingMore]);

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
        <p className="text-muted-foreground">{`${gallery.filecount.toString()} pages`}</p>
      </div>

      {images.map((url, index) => (
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

      {loadingMore ? <p className="py-6 text-sm text-muted-foreground">Loading more pages...</p> : null}
      {hasMore ? <div ref={loadMoreTriggerRef} className="h-8 w-full" aria-hidden="true" /> : null}
      {!hasMore && images.length > 0
        ? <p className="py-6 text-sm text-muted-foreground">All pages loaded.</p>
        : null}
    </div>
  );
}
