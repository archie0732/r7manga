import type { DoujinSearchResult } from '../../nhentai/search/route';

export type FavoriteWebsite = 'nhentai' | 'wnacg' | 'hentaipaw' | 'ehentai';

export interface FavoriteDoujinItem {
  id: string;
  title: string;
  thumbnail: string;
  lang: string;
  page: number;
  source?: string;
}

export interface FavoriteData {
  name: string;
  id: string;
  favorite_nhentai: {
    doujin: DoujinSearchResult[];
    artist: string[];
    character: string[];
  };
  favorite_wnacg?: {
    doujin: FavoriteDoujinItem[];
  };
  favorite_hentaipaw?: {
    doujin: FavoriteDoujinItem[];
  };
  favorite_ehentai?: {
    doujin: FavoriteDoujinItem[];
  };
}

export interface FavoriteAdd {
  type: 'character' | 'artist' | 'doujin';
  website?: FavoriteWebsite;
  doujin?: DoujinSearchResult | FavoriteDoujinItem;
  artist?: string;
  character?: string;
}

export interface FavoriteRemove {
  type: 'doujin';
  website: Exclude<FavoriteWebsite, 'nhentai'>;
  id: string;
}

export interface GitHubFileResponse {
  sha: string;
  content: string; // Base64-encoded content
}
