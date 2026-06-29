import type {
  FavoriteAdd,
  FavoriteBulkRemove,
  FavoriteCollectionMutation,
  FavoriteData,
  FavoriteDoujinItem,
  FavoriteMetadataHydrate,
  FavoriteRemove,
  FavoriteWebsite,
} from './apitype';
import type { DoujinSearchResult } from '../../nhentai/search/route';

type FavoriteDoujinBucket = {
  doujin: FavoriteDoujinItem[];
};

type FavoriteEhentaiBucket = FavoriteDoujinBucket & {
  collections: NonNullable<FavoriteData['favorite_ehentai']>['collections'];
};

const emptyDoujinBucket = (): FavoriteDoujinBucket => ({
  doujin: [],
});

const emptyEhentaiBucket = (): FavoriteEhentaiBucket => ({
  doujin: [],
  collections: [],
});

export const ensureFavoriteShape = (input: FavoriteData | null | undefined): FavoriteData => ({
  name: input?.name ?? '',
  id: input?.id ?? '',
  favorite_nhentai: {
    doujin: input?.favorite_nhentai?.doujin ?? [],
    artist: input?.favorite_nhentai?.artist ?? [],
    character: input?.favorite_nhentai?.character ?? [],
  },
  favorite_wnacg: input?.favorite_wnacg ?? emptyDoujinBucket(),
  favorite_hentaipaw: input?.favorite_hentaipaw ?? emptyDoujinBucket(),
  favorite_ehentai: {
    doujin: input?.favorite_ehentai?.doujin ?? [],
    collections: input?.favorite_ehentai?.collections ?? [],
  },
});

const doujinKeyMap = {
  wnacg: 'favorite_wnacg',
  hentaipaw: 'favorite_hentaipaw',
  ehentai: 'favorite_ehentai',
} satisfies Record<Exclude<FavoriteWebsite, 'nhentai'>, 'favorite_wnacg' | 'favorite_hentaipaw' | 'favorite_ehentai'>;

const isCustomWebsite = (website: FavoriteWebsite | undefined): website is Exclude<FavoriteWebsite, 'nhentai'> =>
  website === 'wnacg' || website === 'hentaipaw' || website === 'ehentai';

const isNhentaiDoujin = (doujin: FavoriteAdd['doujin']): doujin is DoujinSearchResult =>
  Boolean(doujin && 'banTag' in doujin);

const normalizeDoujin = (doujin: FavoriteAdd['doujin']): FavoriteDoujinItem => {
  if (!doujin) {
    return {
      id: '',
      title: '',
      thumbnail: '',
      lang: 'zh',
      page: 0,
    };
  }

  return {
    id: doujin.id,
    title: doujin.title,
    thumbnail: doujin.thumbnail,
    lang: doujin.lang,
    page: doujin.page,
    source: isNhentaiDoujin(doujin) ? undefined : doujin.source,
    artists: isNhentaiDoujin(doujin) ? undefined : doujin.artists,
    parodies: isNhentaiDoujin(doujin) ? undefined : doujin.parodies,
  };
};

const touchCollection = <T extends { updatedAt: string }>(collection: T) => ({
  ...collection,
  updatedAt: new Date().toISOString(),
});

const copyWithMetadata = (
  item: FavoriteDoujinItem,
  update: Pick<FavoriteDoujinItem, 'artists' | 'parodies'>,
): FavoriteDoujinItem => ({
  ...item,
  artists: update.artists,
  parodies: update.parodies,
});

export const addFavoriteEntry = (input: FavoriteData | null | undefined, body: FavoriteAdd): FavoriteData => {
  const data = ensureFavoriteShape(input);

  if (body.type === 'doujin' && body.doujin && isCustomWebsite(body.website)) {
    const key = doujinKeyMap[body.website];
    const next = normalizeDoujin(body.doujin);
    const bucket = data[key] ?? emptyDoujinBucket();
    data[key] = bucket;
    const exists = bucket.doujin.some((item) => item.id === next.id);

    if (!exists) {
      bucket.doujin.push(next);
    }

    return data;
  }

  if (body.type === 'doujin' && body.doujin && isNhentaiDoujin(body.doujin)) {
    data.favorite_nhentai.doujin.push(body.doujin);
    return data;
  }

  if (body.type === 'artist' && body.artist) {
    data.favorite_nhentai.artist.push(body.artist);
    return data;
  }

  if (body.type === 'character' && body.character) {
    data.favorite_nhentai.character.push(body.character);
    return data;
  }

  throw new Error('Post data error');
};

export const mutateFavoriteCollections = (
  input: FavoriteData | null | undefined,
  mutation: FavoriteCollectionMutation,
): FavoriteData => {
  const data = ensureFavoriteShape(input);
  const bucket = data.favorite_ehentai ?? emptyEhentaiBucket();
  data.favorite_ehentai = {
    doujin: bucket.doujin ?? [],
    collections: bucket.collections ?? [],
  };

  if (mutation.type === 'ehentai-collection-create') {
    const name = mutation.name.trim();

    if (!name || mutation.itemIds.length === 0) {
      throw new Error('Invalid collection create');
    }

    const items = mutation.itemIds.map((id) => {
      const found = data.favorite_ehentai?.doujin.find((item) => item.id === id);

      if (!found) {
        throw new Error(`Missing favorite item: ${id}`);
      }

      return { ...found };
    });

    const now = new Date().toISOString();
    data.favorite_ehentai.collections?.push({
      id: crypto.randomUUID(),
      name,
      items,
      createdAt: now,
      updatedAt: now,
    });

    return data;
  }

  const collections = data.favorite_ehentai.collections ?? [];
  const index = collections.findIndex((collection) => collection.id === mutation.collectionId);

  if (index === -1) {
    throw new Error('Collection not found');
  }

  const collection = collections[index]!;

  if (mutation.type === 'ehentai-collection-append') {
    const existingIds = new Set(collection.items.map((item) => item.id));
    const itemsToAppend = mutation.itemIds.flatMap((id) => {
      if (existingIds.has(id)) {
        return [];
      }

      const found = data.favorite_ehentai?.doujin.find((item) => item.id === id);

      if (!found) {
        throw new Error(`Missing favorite item: ${id}`);
      }

      existingIds.add(id);
      return [{ ...found }];
    });

    collections[index] = touchCollection({
      ...collection,
      items: [...collection.items, ...itemsToAppend],
    });
    return data;
  }

  if (mutation.type === 'ehentai-collection-rename') {
    const name = mutation.name.trim();

    if (!name) {
      throw new Error('Invalid collection name');
    }

    collections[index] = touchCollection({
      ...collection,
      name,
    });
    return data;
  }

  if (mutation.type === 'ehentai-collection-reorder') {
    const items = mutation.itemIds.map((id) => {
      const found = collection.items.find((item) => item.id === id);

      if (!found) {
        throw new Error(`Collection item not found: ${id}`);
      }

      return found;
    });

    collections[index] = touchCollection({
      ...collection,
      items,
    });
    return data;
  }

  if (mutation.type === 'ehentai-collection-remove-item') {
    collections[index] = touchCollection({
      ...collection,
      items: collection.items.filter((item) => item.id !== mutation.itemId),
    });
    return data;
  }

  data.favorite_ehentai.collections = collections.filter((item) => item.id !== mutation.collectionId);
  return data;
};

export const hydrateFavoriteMetadata = (
  input: FavoriteData | null | undefined,
  mutation: FavoriteMetadataHydrate,
): FavoriteData => {
  const data = ensureFavoriteShape(input);
  const bucket = data.favorite_ehentai ?? emptyEhentaiBucket();
  data.favorite_ehentai = bucket;
  const nextArtists = [...mutation.artists];
  const nextParodies = [...mutation.parodies];

  bucket.doujin = bucket.doujin.map((item) => {
    if (item.id !== mutation.id) {
      return item;
    }

    const sameArtists = JSON.stringify(item.artists ?? []) === JSON.stringify(nextArtists);
    const sameParodies = JSON.stringify(item.parodies ?? []) === JSON.stringify(nextParodies);

    return sameArtists && sameParodies
      ? item
      : copyWithMetadata(item, { artists: nextArtists, parodies: nextParodies });
  });

  bucket.collections = (bucket.collections ?? []).map((collection) => {
    const hasTarget = collection.items.some((item) => item.id === mutation.id);

    if (!hasTarget) {
      return collection;
    }

    return touchCollection({
      ...collection,
      items: collection.items.map((item) =>
        item.id === mutation.id
          ? copyWithMetadata(item, { artists: nextArtists, parodies: nextParodies })
          : item),
    });
  });

  return data;
};

export const removeFavoriteEntry = (input: FavoriteData | null | undefined, body: FavoriteRemove): FavoriteData => {
  const data = ensureFavoriteShape(input);
  const key = doujinKeyMap[body.website];
  const bucket = data[key] ?? emptyDoujinBucket();

  bucket.doujin = bucket.doujin.filter((item) => item.id !== body.id);
  data[key] = bucket;

  return data;
};

export const bulkRemoveFavoriteEntries = (
  input: FavoriteData | null | undefined,
  body: FavoriteBulkRemove,
): FavoriteData => {
  const data = ensureFavoriteShape(input);
  const key = doujinKeyMap[body.website];
  const bucket = data[key] ?? emptyDoujinBucket();
  const ids = new Set(body.ids);

  bucket.doujin = bucket.doujin.filter((item) => !ids.has(item.id));
  data[key] = bucket;

  if (body.website === 'ehentai') {
    const ehentaiBucket = data.favorite_ehentai ?? emptyEhentaiBucket();
    data.favorite_ehentai = ehentaiBucket;
    ehentaiBucket.collections = (ehentaiBucket.collections ?? []).map((collection) => ({
      ...collection,
      items: collection.items.filter((item) => !ids.has(item.id)),
      updatedAt: ids.size > 0 ? new Date().toISOString() : collection.updatedAt,
    }));
  }

  return data;
};

export const isDoujinFavorited = (
  input: FavoriteData | null | undefined,
  website: Exclude<FavoriteWebsite, 'nhentai'>,
  id: string,
) => {
  const data = ensureFavoriteShape(input);
  const key = doujinKeyMap[website];
  return (data[key] ?? emptyDoujinBucket()).doujin.some((item) => item.id === id);
};
