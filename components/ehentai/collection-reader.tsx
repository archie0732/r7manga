'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import type { EhentaiCollection } from '@/app/api/favorite/_model/apitype';
import type { EhentaiGalleryDetail } from '@/app/api/ehentai/_model/client';

import { EHENTAI_IMAGE_BATCH_SIZE } from '@/app/api/ehentai/_model/client';
import { Button } from '@/components/ui/button';
import { buildCollectionReadQueue } from './collection-reader-utils';

type Props = Readonly<{
  collection: EhentaiCollection;
}>;

export function CollectionReader({ collection }: Props) {
  const queue = useMemo(() => buildCollectionReadQueue(collection.items), [collection.items]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [details, setDetails] = useState<Record<string, EhentaiGalleryDetail>>({});
  const [images, setImages] = useState<Record<string, string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const loadDetail = async (galleryId: string) => {
    if (details[galleryId]) {
      return details[galleryId];
    }

    const response = await fetch(`/api/ehentai/${galleryId}`);

    if (!response.ok) {
      throw new Error(`Failed to load gallery ${galleryId}`);
    }

    const detail = await response.json() as EhentaiGalleryDetail;
    setDetails((current) => ({
      ...current,
      [galleryId]: detail,
    }));
    return detail;
  };

  const loadBatch = async (index: number): Promise<void> => {
    const item = queue[index];

    if (!item) {
      return;
    }

    setPending(true);

    try {
      const detail = await loadDetail(item.id);
      const loadedCount = images[item.id]?.length ?? 0;

      if (loadedCount >= detail.pageLinks.length) {
        if (index < queue.length - 1) {
          setActiveIndex(index + 1);
          await loadBatch(index + 1);
        }
        return;
      }

      const response = await fetch(`/api/ehentai/${item.id}/images?start=${loadedCount.toString()}&count=${EHENTAI_IMAGE_BATCH_SIZE.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to load image batch for ${item.id}`);
      }

      const payload = await response.json() as { images: string[] };
      const nextLoadedCount = loadedCount + payload.images.length;

      setImages((current) => ({
        ...current,
        [item.id]: [...(current[item.id] ?? []), ...payload.images],
      }));

      if (nextLoadedCount >= detail.pageLinks.length && index < queue.length - 1) {
        setActiveIndex(index + 1);
        await loadBatch(index + 1);
      }
    }
    catch (error) {
      setErrors((current) => ({
        ...current,
        [item.id]: error instanceof Error ? error.message : 'Failed to load gallery',
      }));

      if (index < queue.length - 1) {
        setActiveIndex(index + 1);
      }
    }
    finally {
      setPending(false);
    }
  };

  useEffect(() => {
    if (queue.length === 0) {
      return;
    }

    void loadBatch(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue.length]);

  const hasMore = queue.some((item, index) => {
    if (errors[item.id]) {
      return index < queue.length - 1;
    }

    const detail = details[item.id];

    if (!detail) {
      return true;
    }

    return (images[item.id]?.length ?? 0) < detail.pageLinks.length;
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold">{collection.name}</h1>
        <p className="text-sm text-muted-foreground">{`${queue.length.toString()} works in reading order`}</p>
      </div>

      {queue.map((item, index) => {
        const loadedImages = images[item.id] ?? [];
        const detail = details[item.id];
        const error = errors[item.id];
        const isStarted = loadedImages.length > 0 || Boolean(detail) || Boolean(error) || index <= activeIndex;

        if (!isStarted) {
          return null;
        }

        return (
          <section key={item.id} className="space-y-4 border-t pt-6">
            <div>
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{`${item.page.toString()} pages • ${item.lang.toUpperCase()}`}</p>
            </div>

            {loadedImages.map((image, imageIndex) => (
              <Image
                key={`${item.id}-${imageIndex.toString()}`}
                src={image}
                alt={`${item.title}-${imageIndex + 1}`}
                width={1200}
                height={1600}
                className="h-auto w-full max-w-5xl"
              />
            ))}

            {error
              ? <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>
              : null}
          </section>
        );
      })}

      {hasMore
        ? (
            <Button onClick={() => void loadBatch(activeIndex)} disabled={pending}>
              {pending ? 'Loading...' : 'Load more'}
            </Button>
          )
        : null}
    </div>
  );
}
