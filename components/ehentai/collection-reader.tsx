'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Library } from 'lucide-react';

import Image from 'next/image';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { EHENTAI_IMAGE_BATCH_SIZE } from '@/app/api/ehentai/_model/client';

import { buildCollectionReadQueue, getCollectionJumpPlan, shouldAutoLoadCollectionBatch } from './collection-reader-utils';

import type { EhentaiCollection } from '@/app/api/favorite/_model/apitype';
import type { EhentaiGalleryDetail } from '@/app/api/ehentai/_model/client';

type Props = Readonly<{
  collection: EhentaiCollection;
}>;

export function CollectionReader({ collection }: Props) {
  const queue = useMemo(() => buildCollectionReadQueue(collection.items), [collection.items]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [details, setDetails] = useState<Record<string, EhentaiGalleryDetail>>({});
  const [images, setImages] = useState<Record<string, string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [startedGalleryIds, setStartedGalleryIds] = useState<string[]>([]);
  const [pendingScrollTargetId, setPendingScrollTargetId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const loadBatchRef = useRef<((index: number) => Promise<void>) | null>(null);

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

    setStartedGalleryIds((current) => (current.includes(item.id) ? current : [...current, item.id]));
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

  loadBatchRef.current = loadBatch;

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

  const startedGallerySet = useMemo(() => new Set(startedGalleryIds), [startedGalleryIds]);

  const scrollToGallerySection = (galleryId: string) => {
    const node = sectionRefs.current[galleryId];

    if (!node) {
      return false;
    }

    node.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    return true;
  };

  const jumpToGallery = async (galleryId: string) => {
    const plan = getCollectionJumpPlan(queue, activeIndex, galleryId);

    if (plan.targetIndex === -1) {
      return;
    }

    setNavigatorOpen(false);
    setPendingScrollTargetId(galleryId);
    setStartedGalleryIds((current) => (current.includes(galleryId) ? current : [...current, galleryId]));

    if ((images[galleryId]?.length ?? 0) > 0 || errors[galleryId]) {
      requestAnimationFrame(() => {
        if (scrollToGallerySection(galleryId)) {
          setPendingScrollTargetId(null);
        }
      });
      return;
    }

    if (plan.needsLoadingAdvance || !details[galleryId]) {
      await loadBatch(plan.targetIndex);
    }
  };

  useEffect(() => {
    const node = loadMoreTriggerRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      if (shouldAutoLoadCollectionBatch({
        hasMore,
        isIntersecting: entry.isIntersecting,
        pending,
      })) {
        void loadBatchRef.current?.(activeIndex);
      }
    }, {
      rootMargin: '600px 0px',
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [activeIndex, hasMore, pending]);

  useEffect(() => {
    if (!pendingScrollTargetId) {
      return;
    }

    if ((images[pendingScrollTargetId]?.length ?? 0) === 0 && !errors[pendingScrollTargetId]) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      if (scrollToGallerySection(pendingScrollTargetId)) {
        setPendingScrollTargetId(null);
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [errors, images, pendingScrollTargetId]);

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
        const isStarted = loadedImages.length > 0 || Boolean(detail) || Boolean(error) || index <= activeIndex || startedGallerySet.has(item.id);

        if (!isStarted) {
          return null;
        }

        return (
          <section
            key={item.id}
            ref={(node) => {
              sectionRefs.current[item.id] = node;
            }}
            className="scroll-mt-6 space-y-4 border-t pt-6"
          >
            <div>
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{`${item.page.toString()} pages | ${item.lang.toUpperCase()}`}</p>
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
              ? (
                  <div
                    className={`
                      rounded-md border border-destructive/30 bg-destructive/5
                      p-4 text-sm text-destructive
                    `}
                  >
                    {error}
                  </div>
                )
              : null}
          </section>
        );
      })}

      {hasMore ? <div ref={loadMoreTriggerRef} className="h-8 w-full" aria-hidden="true" /> : null}
      {pending ? <p className="text-sm text-muted-foreground">Loading more pages...</p> : null}

      <Popover open={navigatorOpen} onOpenChange={setNavigatorOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon-lg"
            className="fixed right-6 bottom-6 z-40 rounded-full shadow-lg"
            aria-label="Open collection navigator"
          >
            <Library />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" side="top" className="w-80 p-2">
          <div className="space-y-2">
            <div className="px-2 pt-1">
              <h3 className="text-sm font-semibold">Collection navigator</h3>
              <p className="text-xs text-muted-foreground">Jump to the first page of any manga in this collection.</p>
            </div>
            <div className="max-h-80 space-y-1 overflow-y-auto">
              {queue.map((item, index) => {
                const loadedCount = images[item.id]?.length ?? 0;
                const isCurrent = index === activeIndex;

                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="h-auto w-full justify-start px-2 py-2 text-left"
                    onClick={() => void jumpToGallery(item.id)}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {`${loadedCount.toString()} / ${item.page.toString()} loaded${isCurrent ? ' | reading' : ''}`}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
