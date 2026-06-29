import type { DoujinSearchResult } from '../../nhentai/search/route';

export type FavoriteWebsite = 'nhentai' | 'wnacg' | 'hentaipaw' | 'ehentai';

export interface FavoriteDoujinItem {
  id: string;
  title: string;
  thumbnail: string;
  lang: string;
  page: number;
  source?: string;
  artists?: string[];
  parodies?: string[];
}

export interface EhentaiCollection {
  id: string;
  name: string;
  items: FavoriteDoujinItem[];
  createdAt: string;
  updatedAt: string;
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
    collections?: EhentaiCollection[];
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

export interface FavoriteBulkRemove {
  type: 'bulk-doujin';
  website: Exclude<FavoriteWebsite, 'nhentai'>;
  ids: string[];
}

export type FavoriteCollectionMutation =
  | {
    type: 'ehentai-collection-create';
    name: string;
    itemIds: string[];
  }
  | {
    type: 'ehentai-collection-append';
    collectionId: string;
    itemIds: string[];
  }
  | {
    type: 'ehentai-collection-rename';
    collectionId: string;
    name: string;
  }
  | {
    type: 'ehentai-collection-reorder';
    collectionId: string;
    itemIds: string[];
  }
  | {
    type: 'ehentai-collection-remove-item';
    collectionId: string;
    itemId: string;
  }
  | {
    type: 'ehentai-collection-delete';
    collectionId: string;
  };

export interface FavoriteMetadataHydrate {
  type: 'ehentai-hydrate-metadata';
  id: string;
  artists: string[];
  parodies: string[];
}

export interface GitHubFileResponse {
  sha: string;
  content: string; // Base64-encoded content
}
