import { z } from 'zod';
import Manga from './manga.interface';

const MangaList = z.array(Manga);

export class APIfetchError extends Error {
  constructor(
    public sourceWeb: string,
    message: string,
    public status: number,
    public args?: unknown,
  ) {
    super(message);
    this.name = 'APIfetchError';
  }
}

class ArchieAPI {
  private baseURL: string;

  constructor(private sourceWeb: string, baseURL = 'http://localhost:3001/api/') {
    this.baseURL = baseURL;
  }

  private buildURL(func: string, key: string = ''): string {
    const validFuncs = ['artist', 'doujin', 'homepage'];
    if (!validFuncs.includes(func)) {
      throw new Error(`Invalid function type: ${func}`);
    }
    return func === 'homepage'
      ? `${this.baseURL}${this.sourceWeb}/`
      : `${this.baseURL}${this.sourceWeb}/${func}/${key}`;
  }

  private async fetchData(url: string): Promise<unknown> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new APIfetchError(this.sourceWeb, 'Fetch API error', response.status, response.statusText);
    }
    return response.json();
  }

  async getArtistManga(name: string) {
    const url = this.buildURL('artist', name);
    const data = await this.fetchData(url);
    return MangaList.safeParse(data);
  }

  async getHomepageManga() {
    const url = this.buildURL('homepage');
    const data = await this.fetchData(url);
    return MangaList.safeParse(data);
  }
}

export const createArchieAPI = (web: string) => new ArchieAPI(web);
