import 'dotenv/config';

import type { APICdnConfig, APIDoujinData, APIGalleryListItem, APIPathMediaInfo } from '../apitypes';

const NHENTAI_ROOT = process.env.NHENTAI ?? 'https://nhentai.net';
const NHENTAI_API_ROOT = `${NHENTAI_ROOT}/api/v2`;
const NHENTAI_API_KEY = process.env.R7MANGA_ANNO;

const CDN_CONFIG_TTL = 10 * 60 * 1000;

let cdnConfigCache: { data: APICdnConfig; at: number } | null = null;

const withSlash = (value: string) => value.startsWith('/') ? value : `/${value}`;

const trimRightSlash = (value: string) => value.endsWith('/') ? value.slice(0, -1) : value;

const normalizeGalleryPath = (rawPath: string) => {
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    try {
      const parsed = new URL(rawPath);
      rawPath = parsed.pathname;
    }
    catch {
      return rawPath;
    }
  }

  const path = withSlash(rawPath);
  if (path.startsWith('/galleries/')) {
    return path.replace('/galleries', '');
  }

  return path;
};

const joinServerAndPath = (server: string, path: string) => `${trimRightSlash(server)}${withSlash(path)}`;

const createHeaders = () => {
  const headers = new Headers({
    Accept: 'application/json',
  });

  if (NHENTAI_API_KEY) {
    headers.set('Authorization', `Key ${NHENTAI_API_KEY}`);
  }

  return headers;
};

export const fetchNhentai = async (path: string, init?: Omit<RequestInit, 'headers'> & { headers?: HeadersInit }) => {
  const headers = createHeaders();

  if (init?.headers) {
    const overrideHeaders = new Headers(init.headers);
    for (const [key, value] of overrideHeaders.entries()) {
      headers.set(key, value);
    }
  }

  const res = await fetch(`${NHENTAI_API_ROOT}${path}`, {
    ...init,
    headers,
  });

  return res;
};

export const getCdnConfig = async () => {
  const now = Date.now();

  if (cdnConfigCache && now - cdnConfigCache.at < CDN_CONFIG_TTL) {
    return cdnConfigCache.data;
  }

  const response = await fetchNhentai('/config');

  if (!response.ok) {
    throw new Error(`Failed to fetch CDN config: ${response.status.toString()} ${await response.text()}`);
  }

  const raw = await response.json() as APICdnConfig;
  const data: APICdnConfig = {
    image_servers: raw.image_servers ?? [],
    thumb_servers: raw.thumb_servers ?? [],
    announcement: raw.announcement,
  };

  cdnConfigCache = {
    data,
    at: now,
  };

  return data;
};

const legacyPagePath = (doujin: APIDoujinData, page: number) => `/${doujin.media_id}/${(page + 1).toString()}.${ImageExtensions[doujin.images?.pages[page]?.t ?? 'j']}`;

export function toImagePath(
  doujin: APIDoujinData,
  page: number,
) {
  const pageInfo = doujin.pages?.[page];
  if (pageInfo?.path) {
    return normalizeGalleryPath(pageInfo.path);
  }

  if (!doujin.images) {
    return '';
  }

  return normalizeGalleryPath(legacyPagePath(doujin, page));
}

const mediaToImagePath = (media: APIPathMediaInfo | undefined, fallbackPath: string) => {
  if (media?.path) {
    return media.path;
  }

  return fallbackPath;
};

export const toThumbnailUrl = async (doujin: APIDoujinData) => {
  const cdn = await getCdnConfig();
  const thumbServer = cdn.thumb_servers[0] ?? 'https://t1.nhentai.net';

  const legacyPath = `/galleries/${doujin.media_id}/thumb.${ImageExtensions[doujin.images?.thumbnail.t ?? 'j']}`;
  const path = mediaToImagePath(doujin.thumbnail, legacyPath);

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return joinServerAndPath(thumbServer, path);
};

export const toCoverUrl = async (doujin: APIDoujinData) => {
  const cdn = await getCdnConfig();
  const thumbServer = cdn.thumb_servers[0] ?? 'https://t1.nhentai.net';

  const legacyPath = `/galleries/${doujin.media_id}/cover.${ImageExtensions[doujin.images?.cover.t ?? 'j']}`;
  const path = mediaToImagePath(doujin.cover, legacyPath);

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return joinServerAndPath(thumbServer, path);
};

export const listItemThumbnailUrl = async (item: APIGalleryListItem) => {
  const cdn = await getCdnConfig();
  const thumbServer = cdn.thumb_servers[0] ?? 'https://t1.nhentai.net';

  if (item.thumbnail.startsWith('http://') || item.thumbnail.startsWith('https://')) {
    return item.thumbnail;
  }

  return joinServerAndPath(thumbServer, item.thumbnail);
};

export const ImageExtensions = {
  p: 'png',
  j: 'jpg',
  w: 'webp',
  g: 'gif',
};

export const throwErrorAPI = (sourceWeb: string, status: number, message: string) => {
  return {
    sourceWeb,
    status,
    detail: message,
  };
};

export const languageMap: Partial<Record<string, 'ja' | 'zh' | 'en'>> = {
  6346: 'ja',
  29963: 'zh',
  12227: 'en',
};

export const langFromTagIds = (tagIds?: number[]) => {
  if (!tagIds) {
    return 'ja' as const;
  }

  for (const tagId of tagIds) {
    const lang = languageMap[tagId.toString()];
    if (lang) {
      return lang;
    }
  }

  return 'ja' as const;
};
