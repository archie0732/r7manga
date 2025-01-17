import { DoujinSearchResult } from '../../nhentai/search/route';

export interface FavoriteData {
  name: string;
  id: string;
  favorite_nhentai: {
    doujin: DoujinSearchResult[];
    artist: string[];
    character: string[];
  };
}

export interface FavoriteAdd {
  type: 'character' | 'artist' | 'doujin';
  doujin?: DoujinSearchResult;
  artist?: string;
  character?: string;
}

export interface GitHubFileResponse {
  sha: string;
  content: string; // Base64-encoded content
}
