import type {
  FavoriteAdd,
  FavoriteData,
  FavoriteDoujinItem,
  FavoriteRemove,
  FavoriteWebsite,
} from './apitype';
import type { DoujinSearchResult } from '../../nhentai/search/route';

type FavoriteDoujinBucket = {
  doujin: FavoriteDoujinItem[];
};

const emptyDoujinBucket = (): FavoriteDoujinBucket => ({
  doujin: [],
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
  favorite_ehentai: input?.favorite_ehentai ?? emptyDoujinBucket(),
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
  };
};

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

export const removeFavoriteEntry = (input: FavoriteData | null | undefined, body: FavoriteRemove): FavoriteData => {
  const data = ensureFavoriteShape(input);
  const key = doujinKeyMap[body.website];
  const bucket = data[key] ?? emptyDoujinBucket();

  bucket.doujin = bucket.doujin.filter((item) => item.id !== body.id);
  data[key] = bucket;

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
