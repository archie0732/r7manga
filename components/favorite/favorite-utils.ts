import type { FavoriteData, FavoriteDoujinItem } from '@/app/api/favorite/_model/apitype';

export const buildNewestFirstFavorites = <T>(items: T[]) => [...items].reverse();

export const getNextFavoriteItem = <T extends { id: string }>(
  items: T[],
  currentId: string,
) => {
  const currentIndex = items.findIndex((item) => item.id === currentId);

  if (currentIndex === -1 || currentIndex >= items.length - 1) {
    return null;
  }

  return items[currentIndex + 1] ?? null;
};

const favoriteBucketKeyMap = {
  wnacg: 'favorite_wnacg',
  hentaipaw: 'favorite_hentaipaw',
  ehentai: 'favorite_ehentai',
} as const;

export const buildWebsiteFavoriteQueue = (
  data: FavoriteData,
  website: keyof typeof favoriteBucketKeyMap,
): FavoriteDoujinItem[] => buildNewestFirstFavorites(data[favoriteBucketKeyMap[website]]?.doujin ?? []);

export const getWebsiteFavoriteReaderPath = (
  website: keyof typeof favoriteBucketKeyMap,
  id: string,
) => {
  if (website === 'wnacg') {
    return `/w/read/${id}`;
  }

  if (website === 'hentaipaw') {
    return `/p/read/${id}`;
  }

  return `/e/${id}/scroll`;
};
