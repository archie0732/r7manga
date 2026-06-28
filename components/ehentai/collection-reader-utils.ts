import type { FavoriteDoujinItem } from '@/app/api/favorite/_model/apitype';

export const buildCollectionReadQueue = (items: FavoriteDoujinItem[]) => [...items];

export const buildFilteredReadQueue = (
  items: FavoriteDoujinItem[],
  selectedIds: string[],
) => selectedIds
  .map((id) => items.find((item) => item.id === id))
  .filter((item): item is FavoriteDoujinItem => Boolean(item));

type CollectionJumpPlan = {
  targetIndex: number;
  nextActiveIndex: number;
  needsLoadingAdvance: boolean;
};

type AutoLoadBatchInput = {
  hasMore: boolean;
  isIntersecting: boolean;
  pending: boolean;
};

export const getCollectionJumpPlan = (
  items: FavoriteDoujinItem[],
  activeIndex: number,
  targetId: string,
): CollectionJumpPlan => {
  const targetIndex = items.findIndex((item) => item.id === targetId);

  if (targetIndex === -1) {
    return {
      targetIndex: -1,
      nextActiveIndex: activeIndex,
      needsLoadingAdvance: false,
    };
  }

  return {
    targetIndex,
    nextActiveIndex: Math.max(activeIndex, targetIndex),
    needsLoadingAdvance: targetIndex > activeIndex,
  };
};

export const shouldAutoLoadCollectionBatch = ({
  hasMore,
  isIntersecting,
  pending,
}: AutoLoadBatchInput) => hasMore && isIntersecting && !pending;
