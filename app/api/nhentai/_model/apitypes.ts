export type APIImageExtensionType = 'w' | 'j' | 'p' | 'g';

export interface APILegacyDoujinPageData {
  t: APIImageExtensionType;
  w: number;
  h: number;
}

export interface APIPathMediaInfo {
  path: string;
  width?: number;
  height?: number;
}

export interface APIDoujinTagData {
  id: number;
  type: string;
  name: string;
  slug?: string;
  /**
   * @example '/tag/milf/'
   */
  url: string;
  count: number;
}

export interface APIGalleryTitle {
  english: string;
  japanese?: string | null;
  pretty: string;
}

export interface APIGalleryListItem {
  id: number;
  media_id: string;
  english_title: string;
  japanese_title: string | null;
  thumbnail: string;
  thumbnail_width: number;
  thumbnail_height: number;
  num_pages?: number;
  tag_ids?: number[];
  blacklisted?: boolean;
}

export interface APIDoujinData {
  id: number;
  media_id: string;
  title: APIGalleryTitle;
  cover?: APIPathMediaInfo;
  thumbnail?: APIPathMediaInfo;
  pages?: APIPathMediaInfo[];
  images?: {
    pages: APILegacyDoujinPageData[];
    cover: APILegacyDoujinPageData;
    thumbnail: APILegacyDoujinPageData;
  };
  scanlator: string;
  upload_date: number;
  tags: APIDoujinTagData[];
  num_pages: number;
  num_favorites: number;
}

export interface APIPaginatedSearchResultData {
  result: APIGalleryListItem[];
  num_pages: number;
  per_page?: number;
  total?: number | null;
}

export interface APIRelatedResultData {
  result: APIGalleryListItem[];
}

export interface APICdnConfig {
  image_servers: string[];
  thumb_servers: string[];
  announcement?: unknown;
}
