import { describe, expect, test } from 'bun:test';

import { addFavoriteEntry, ensureFavoriteShape, isDoujinFavorited, removeFavoriteEntry } from './store';

describe('favorite store helpers', () => {
  test('ensureFavoriteShape adds custom website buckets without touching nhentai data', () => {
    const data = ensureFavoriteShape({
      name: 'tester',
      id: '1',
      favorite_nhentai: {
        doujin: [{ id: 'n1', title: 'n', thumbnail: 'thumb', banTag: [], lang: 'ja', page: 1 }],
        artist: ['a1'],
        character: ['c1'],
      },
    });

    expect(data.favorite_nhentai.doujin).toHaveLength(1);
    expect(data.favorite_wnacg?.doujin).toEqual([]);
    expect(data.favorite_hentaipaw?.doujin).toEqual([]);
    expect(data.favorite_ehentai?.doujin).toEqual([]);
  });

  test('addFavoriteEntry stores wnacg doujin in favorite.json custom bucket', () => {
    const data = addFavoriteEntry(undefined, {
      type: 'doujin',
      website: 'wnacg',
      doujin: {
        id: '220123',
        title: 'Album Title',
        thumbnail: 'https://img.example/cover.jpg',
        lang: 'zh',
        page: 30,
        source: 'https://www.wnacg.com/photos-index-aid-220123.html',
      },
    });

    expect(data.favorite_wnacg?.doujin).toHaveLength(1);
    expect(data.favorite_wnacg?.doujin[0]?.id).toBe('220123');
    expect(isDoujinFavorited(data, 'wnacg', '220123')).toBe(true);
  });

  test('addFavoriteEntry skips duplicate custom website favorites', () => {
    const once = addFavoriteEntry(undefined, {
      type: 'doujin',
      website: 'ehentai',
      doujin: {
        id: '123-token',
        title: 'Gallery',
        thumbnail: 'https://img.example/cover.jpg',
        lang: 'en',
        page: 20,
      },
    });

    const twice = addFavoriteEntry(once, {
      type: 'doujin',
      website: 'ehentai',
      doujin: {
        id: '123-token',
        title: 'Gallery',
        thumbnail: 'https://img.example/cover.jpg',
        lang: 'en',
        page: 20,
      },
    });

    expect(twice.favorite_ehentai?.doujin).toHaveLength(1);
  });

  test('removeFavoriteEntry removes only the targeted custom website favorite', () => {
    const data = addFavoriteEntry(undefined, {
      type: 'doujin',
      website: 'hentaipaw',
      doujin: {
        id: '3407674',
        title: 'Sample Title',
        thumbnail: 'https://cdn.example/cover.webp',
        lang: 'zh',
        page: 12,
      },
    });

    const next = removeFavoriteEntry(data, {
      type: 'doujin',
      website: 'hentaipaw',
      id: '3407674',
    });

    expect(next.favorite_hentaipaw?.doujin).toEqual([]);
    expect(isDoujinFavorited(next, 'hentaipaw', '3407674')).toBe(false);
  });
});
