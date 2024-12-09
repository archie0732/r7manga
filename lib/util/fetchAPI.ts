import { z } from 'zod';
import Manga from './manga.interface';

const MangaList = z.array(Manga);

export class ArchieAPI {
  commonURL = 'http://localhost:3001/api/';
  sourceWeb: string;

  constructor(source: string) {
    this.sourceWeb = source;
  }

  getURL(func: string, key: string) {
    if (func === 'artist' || func === 'doujin') {
      return this.commonURL + this.commonURL + '/' + func + '/' + key;
    }
    else {
      return this.commonURL;
    }
  }

  async fetch(url: string) {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new APIfetchError(this.sourceWeb, 'fetch API error', resp.status, resp.statusText);
    }

    return await resp.json() as never;
  }

  // artist
  async artist(name: string) {
    const json = await this.fetch(this.getURL('artist', name));

    return MangaList.safeParse(json);
  }
}

export class APIfetchError extends Error {
  sourceWeb: string;
  status: number;
  arg: unknown[] | undefined;
  constructor(sourceWeb: string, message: string, status: number, ...arg: unknown[]) {
    super(message);
    this.sourceWeb = sourceWeb;
    this.message = message;
    this.status = status;
    this.arg = arg;
  }
}

export const archieAPI = (web: string) => {
  return new ArchieAPI(web);
};
