import { APIDoujinData } from '../apitypes';

export const toImageUrl = (doujin: APIDoujinData, page: number) => `https://i3.nhentai.net/galleries/${doujin.media_id}/${page.toString()}.${ImageExtensions[doujin.images.pages[page].t]}` as const;
export const toThumbnailUrl = (doujin: APIDoujinData) => `https://t3.nhentai.net/galleries/${doujin.media_id}/thumb.${ImageExtensions[doujin.images.thumbnail.t]}` as const;

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
