import { describe, expect, test } from 'bun:test';

import {
  buildNewestFirstFavorites,
  buildWebsiteFavoriteQueue,
  getNextFavoriteItem,
  getWebsiteFavoriteReaderPath,
} from './favorite-utils';

describe('favorite utils', () => {
  test('buildNewestFirstFavorites returns a reversed copy without mutating the input', () => {
    const original = [
      { id: 'old', title: 'Old', thumbnail: '1', banTag: [], lang: 'ja' as const, page: 10 },
      { id: 'new', title: 'New', thumbnail: '2', banTag: [], lang: 'zh' as const, page: 20 },
    ];

    const reordered = buildNewestFirstFavorites(original);

    expect(reordered.map((item) => item.id)).toEqual(['new', 'old']);
    expect(original.map((item) => item.id)).toEqual(['old', 'new']);
  });

  test('getNextFavoriteItem follows newest-first reading order', () => {
    const queue = [
      { id: 'latest', title: 'Latest', thumbnail: '1', banTag: [], lang: 'ja' as const, page: 30 },
      { id: 'middle', title: 'Middle', thumbnail: '2', banTag: [], lang: 'zh' as const, page: 20 },
      { id: 'oldest', title: 'Oldest', thumbnail: '3', banTag: [], lang: 'en' as const, page: 10 },
    ];

    expect(getNextFavoriteItem(queue, 'latest')?.id).toBe('middle');
    expect(getNextFavoriteItem(queue, 'middle')?.id).toBe('oldest');
  });

  test('getNextFavoriteItem returns null for unknown or last favorites', () => {
    const queue = [
      { id: 'latest', title: 'Latest', thumbnail: '1', banTag: [], lang: 'ja' as const, page: 30 },
      { id: 'oldest', title: 'Oldest', thumbnail: '2', banTag: [], lang: 'zh' as const, page: 10 },
    ];

    expect(getNextFavoriteItem(queue, 'oldest')).toBeNull();
    expect(getNextFavoriteItem(queue, 'missing')).toBeNull();
  });

  test('buildWebsiteFavoriteQueue uses newest-first order for custom website favorites', () => {
    const queue = buildWebsiteFavoriteQueue({
      name: '',
      id: '',
      favorite_nhentai: {
        doujin: [],
        artist: [],
        character: [],
      },
      favorite_wnacg: {
        doujin: [
          { id: 'old', title: 'Old', thumbnail: '1', lang: 'zh', page: 10 },
          { id: 'new', title: 'New', thumbnail: '2', lang: 'zh', page: 20 },
        ],
      },
      favorite_hentaipaw: {
        doujin: [],
      },
      favorite_ehentai: {
        doujin: [],
        collections: [],
      },
    }, 'wnacg');

    expect(queue.map((item) => item.id)).toEqual(['new', 'old']);
  });

  test('getWebsiteFavoriteReaderPath builds the correct reader route per website', () => {
    expect(getWebsiteFavoriteReaderPath('wnacg', '123')).toBe('/w/read/123');
    expect(getWebsiteFavoriteReaderPath('hentaipaw', '456')).toBe('/p/read/456');
    expect(getWebsiteFavoriteReaderPath('ehentai', '789')).toBe('/e/789/scroll');
  });
});
