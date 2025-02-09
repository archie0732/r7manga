import { resolve } from 'path';
import { APIDoujinData } from '../apitypes';
import 'dotenv/config';
import { readFileSync } from 'fs';

export function toImageUrl(
  doujin: APIDoujinData,
  page: number,
  truncate = false,
) {
  const path = `/${doujin.media_id}/${(page + 1).toString()}.${ImageExtensions[doujin.images.pages[page].t]}` as const;

  return truncate ? path : `https://i3.nhentai.net/galleries${path}` as const;
};

export const toThumbnailUrl = (doujin: APIDoujinData) => `https://t1.nhentai.net/galleries/${doujin.media_id}/thumb.${ImageExtensions[doujin.images.thumbnail.t]}` as const;
export const toCoverUrl = (doujin: APIDoujinData) => `https://t1.nhentai.net/galleries/${doujin.media_id}/cover.${ImageExtensions[doujin.images.cover.t]}` as const;

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

export const fetchCFToken = () => {
  const path = resolve('cf.json');
  const json = JSON.parse(readFileSync(path, 'utf-8')) as { user_agent: string;cf_clearance: string };

  return json;
};
