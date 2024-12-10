export type APIImageExtensionType = 'w' | 'j' | 'p' | 'g';

export interface APIDoujinPageData {
  t: APIImageExtensionType;
  w: number;
  h: number;
}

export interface APIDoujinTagData {
  id: number;
  type: string;
  name: string;
  /**
   * @example '/tag/milf/'
   */
  url: string;
  count: number;
}

export interface APIDoujinData {
  id: number;
  media_id: string;
  title: {
    english: string;
    japanese?: string;
    pretty: string;
  };
  images: {
    pages: APIDoujinPageData[];
    cover: APIDoujinPageData;
    thumbnail: APIDoujinPageData;
  };
  scanlator: string;
  upload_date: number;
  tags: APIDoujinTagData[];
  num_pages: number;
  num_favorites: number;
}

export interface APISearchResultData {
  result: APIDoujinData[];
}
