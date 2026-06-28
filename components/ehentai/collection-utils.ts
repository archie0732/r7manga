import type { FavoriteDoujinItem } from '@/app/api/favorite/_model/apitype';

type FilterOption = {
  value: string;
  count: number;
};

type EhentaiFilters = {
  artists: string[];
  parodies: string[];
};

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

const toSortedOptions = (counts: Map<string, number>): FilterOption[] =>
  [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));

export const buildEhentaiFilterOptions = (favorites: FavoriteDoujinItem[]) => {
  const artistCounts = new Map<string, number>();
  const parodyCounts = new Map<string, number>();

  for (const favorite of favorites) {
    for (const artist of favorite.artists ?? []) {
      artistCounts.set(artist, (artistCounts.get(artist) ?? 0) + 1);
    }

    for (const parody of favorite.parodies ?? []) {
      parodyCounts.set(parody, (parodyCounts.get(parody) ?? 0) + 1);
    }
  }

  return {
    artists: toSortedOptions(artistCounts),
    parodies: toSortedOptions(parodyCounts),
  };
};

export const filterEhentaiFavorites = (
  favorites: FavoriteDoujinItem[],
  filters: EhentaiFilters,
) => favorites.filter((favorite) => {
  const hasArtistFilter = filters.artists.length > 0;
  const hasParodyFilter = filters.parodies.length > 0;

  if (!hasArtistFilter && !hasParodyFilter) {
    return true;
  }

  const favoriteArtists = favorite.artists ?? [];
  const favoriteParodies = favorite.parodies ?? [];
  const artistMatch = !hasArtistFilter || favoriteArtists.some((artist) => filters.artists.includes(artist));
  const parodyMatch = !hasParodyFilter || favoriteParodies.some((parody) => filters.parodies.includes(parody));

  return artistMatch && parodyMatch;
});

export const buildCollectionPreviewCovers = (items: FavoriteDoujinItem[]) =>
  items.slice(0, 4).map((item) => item.thumbnail);

export const findFavoritesMissingEhentaiMetadata = (favorites: FavoriteDoujinItem[]) =>
  favorites.filter((favorite) => favorite.artists === undefined || favorite.parodies === undefined);
