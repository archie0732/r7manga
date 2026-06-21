import type { FavoriteDoujinItem } from '@/app/api/favorite/_model/apitype';

export const buildSelectedCollectionItems = (
  favorites: FavoriteDoujinItem[],
  itemIds: string[],
) => itemIds.map((id) => favorites.find((item) => item.id === id)).filter((item): item is FavoriteDoujinItem => Boolean(item));

export const moveCollectionItem = (
  items: FavoriteDoujinItem[],
  index: number,
  direction: 'up' | 'down',
) => {
  const next = [...items];
  const targetIndex = direction === 'up' ? index - 1 : index + 1;

  if (index < 0 || index >= next.length || targetIndex < 0 || targetIndex >= next.length) {
    return next;
  }

  [next[index], next[targetIndex]] = [next[targetIndex]!, next[index]!];
  return next;
};
