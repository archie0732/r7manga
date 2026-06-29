import { describe, expect, test } from 'bun:test';

import {
  addFavoriteEntry,
  bulkRemoveFavoriteEntries,
  ensureFavoriteShape,
  hydrateFavoriteMetadata,
  isDoujinFavorited,
  mutateFavoriteCollections,
  removeFavoriteEntry,
} from './store';

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
    expect(data.favorite_ehentai?.collections).toEqual([]);
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

  test('addFavoriteEntry preserves ehentai artist and parody metadata when provided', () => {
    const data = addFavoriteEntry(undefined, {
      type: 'doujin',
      website: 'ehentai',
      doujin: {
        id: '123-token',
        title: 'Gallery',
        thumbnail: 'https://img.example/cover.jpg',
        lang: 'ja',
        page: 22,
        source: 'https://e-hentai.org/g/123/token/',
        artists: ['soso'],
        parodies: ['fate grand order'],
      },
    });

    expect(data.favorite_ehentai?.doujin[0]).toMatchObject({
      artists: ['soso'],
      parodies: ['fate grand order'],
    });
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

  test('bulkRemoveFavoriteEntries removes multiple ehentai favorites and collection snapshots', () => {
    const seeded = ensureFavoriteShape({
      name: '',
      id: '',
      favorite_nhentai: { doujin: [], artist: [], character: [] },
      favorite_ehentai: {
        doujin: [
          { id: 'a', title: 'A', thumbnail: 'a', lang: 'ja', page: 1, source: 'sa' },
          { id: 'b', title: 'B', thumbnail: 'b', lang: 'ja', page: 1, source: 'sb' },
          { id: 'c', title: 'C', thumbnail: 'c', lang: 'ja', page: 1, source: 'sc' },
        ],
        collections: [{
          id: 'col-1',
          name: 'Set',
          createdAt: '2026-06-29T00:00:00.000Z',
          updatedAt: '2026-06-29T00:00:00.000Z',
          items: [
            { id: 'a', title: 'A', thumbnail: 'a', lang: 'ja', page: 1, source: 'sa' },
            { id: 'b', title: 'B', thumbnail: 'b', lang: 'ja', page: 1, source: 'sb' },
          ],
        }],
      },
    });

    const next = bulkRemoveFavoriteEntries(seeded, {
      type: 'bulk-doujin',
      website: 'ehentai',
      ids: ['a', 'c'],
    });

    expect(next.favorite_ehentai?.doujin.map((item) => item.id)).toEqual(['b']);
    expect(next.favorite_ehentai?.collections?.[0]?.items.map((item) => item.id)).toEqual(['b']);
  });

  test('createEhentaiCollection stores a named collection in favorite data', () => {
    const base = addFavoriteEntry(undefined, {
      type: 'doujin',
      website: 'ehentai',
      doujin: {
        id: '111-token',
        title: 'Gallery One',
        thumbnail: 'https://img.example/1.jpg',
        lang: 'ja',
        page: 10,
        source: 'https://e-hentai.org/g/111/token/',
      },
    });

    const withSecond = addFavoriteEntry(base, {
      type: 'doujin',
      website: 'ehentai',
      doujin: {
        id: '222-token',
        title: 'Gallery Two',
        thumbnail: 'https://img.example/2.jpg',
        lang: 'ja',
        page: 12,
        source: 'https://e-hentai.org/g/222/token/',
      },
    });

    const next = mutateFavoriteCollections(withSecond, {
      type: 'ehentai-collection-create',
      name: 'Weekend Set',
      itemIds: ['111-token', '222-token'],
    });

    expect(next.favorite_ehentai?.collections).toHaveLength(1);
    expect(next.favorite_ehentai?.collections?.[0]).toMatchObject({
      name: 'Weekend Set',
    });
    expect(next.favorite_ehentai?.collections?.[0]?.items.map((item) => item.id)).toEqual(['111-token', '222-token']);
  });

  test('mutateFavoriteCollections renames and reorders an ehentai collection', () => {
    const seeded = ensureFavoriteShape({
      name: '',
      id: '',
      favorite_nhentai: { doujin: [], artist: [], character: [] },
      favorite_ehentai: {
        doujin: [
          { id: '111-token', title: 'Gallery One', thumbnail: '1', lang: 'ja', page: 10, source: 'a' },
          { id: '222-token', title: 'Gallery Two', thumbnail: '2', lang: 'ja', page: 12, source: 'b' },
        ],
        collections: [{
          id: 'col-1',
          name: 'Old Name',
          createdAt: '2026-06-21T00:00:00.000Z',
          updatedAt: '2026-06-21T00:00:00.000Z',
          items: [
            { id: '111-token', title: 'Gallery One', thumbnail: '1', lang: 'ja', page: 10, source: 'a' },
            { id: '222-token', title: 'Gallery Two', thumbnail: '2', lang: 'ja', page: 12, source: 'b' },
          ],
        }],
      },
    });

    const renamed = mutateFavoriteCollections(seeded, {
      type: 'ehentai-collection-rename',
      collectionId: 'col-1',
      name: 'New Name',
    });
    const reordered = mutateFavoriteCollections(renamed, {
      type: 'ehentai-collection-reorder',
      collectionId: 'col-1',
      itemIds: ['222-token', '111-token'],
    });

    expect(reordered.favorite_ehentai?.collections?.[0]?.name).toBe('New Name');
    expect(reordered.favorite_ehentai?.collections?.[0]?.items.map((item) => item.id)).toEqual(['222-token', '111-token']);
  });

  test('mutateFavoriteCollections appends only missing items to an existing collection in selection order', () => {
    const seeded = ensureFavoriteShape({
      name: '',
      id: '',
      favorite_nhentai: { doujin: [], artist: [], character: [] },
      favorite_ehentai: {
        doujin: [
          { id: 'a', title: 'A', thumbnail: 'a', lang: 'ja', page: 1, source: 'sa' },
          { id: 'b', title: 'B', thumbnail: 'b', lang: 'ja', page: 1, source: 'sb' },
          { id: 'c', title: 'C', thumbnail: 'c', lang: 'ja', page: 1, source: 'sc' },
        ],
        collections: [{
          id: 'col-1',
          name: 'Set',
          createdAt: '2026-06-28T00:00:00.000Z',
          updatedAt: '2026-06-28T00:00:00.000Z',
          items: [
            { id: 'a', title: 'A', thumbnail: 'a', lang: 'ja', page: 1, source: 'sa' },
          ],
        }],
      },
    });

    const next = mutateFavoriteCollections(seeded, {
      type: 'ehentai-collection-append',
      collectionId: 'col-1',
      itemIds: ['c', 'a', 'b'],
    });

    expect(next.favorite_ehentai?.collections?.[0]?.items.map((item) => item.id)).toEqual(['a', 'c', 'b']);
  });

  test('mutateFavoriteCollections removes one item and deletes a collection', () => {
    const seeded = ensureFavoriteShape({
      name: '',
      id: '',
      favorite_nhentai: { doujin: [], artist: [], character: [] },
      favorite_ehentai: {
        doujin: [],
        collections: [{
          id: 'col-1',
          name: 'Set',
          createdAt: '2026-06-21T00:00:00.000Z',
          updatedAt: '2026-06-21T00:00:00.000Z',
          items: [
            { id: 'a', title: 'A', thumbnail: 'a', lang: 'ja', page: 1, source: 'sa' },
            { id: 'b', title: 'B', thumbnail: 'b', lang: 'ja', page: 1, source: 'sb' },
          ],
        }],
      },
    });

    const removedItem = mutateFavoriteCollections(seeded, {
      type: 'ehentai-collection-remove-item',
      collectionId: 'col-1',
      itemId: 'a',
    });
    const deleted = mutateFavoriteCollections(removedItem, {
      type: 'ehentai-collection-delete',
      collectionId: 'col-1',
    });

    expect(removedItem.favorite_ehentai?.collections?.[0]?.items.map((item) => item.id)).toEqual(['b']);
    expect(deleted.favorite_ehentai?.collections).toEqual([]);
  });

  test('hydrateFavoriteMetadata updates saved favorite and collection snapshot copies', () => {
    const seeded = ensureFavoriteShape({
      name: '',
      id: '',
      favorite_nhentai: { doujin: [], artist: [], character: [] },
      favorite_ehentai: {
        doujin: [
          { id: 'x', title: 'X', thumbnail: 'x', lang: 'ja', page: 8, source: 'sx' },
        ],
        collections: [{
          id: 'col-1',
          name: 'Set',
          createdAt: '2026-06-28T00:00:00.000Z',
          updatedAt: '2026-06-28T00:00:00.000Z',
          items: [
            { id: 'x', title: 'X', thumbnail: 'x', lang: 'ja', page: 8, source: 'sx' },
          ],
        }],
      },
    });

    const next = hydrateFavoriteMetadata(seeded, {
      type: 'ehentai-hydrate-metadata',
      id: 'x',
      artists: ['soso'],
      parodies: ['fate grand order'],
    });

    expect(next.favorite_ehentai?.doujin[0]).toMatchObject({
      artists: ['soso'],
      parodies: ['fate grand order'],
    });
    expect(next.favorite_ehentai?.collections?.[0]?.items[0]).toMatchObject({
      artists: ['soso'],
      parodies: ['fate grand order'],
    });
  });

  test('hydrateFavoriteMetadata is a no-op when metadata is already identical', () => {
    const seeded = ensureFavoriteShape({
      name: '',
      id: '',
      favorite_nhentai: { doujin: [], artist: [], character: [] },
      favorite_ehentai: {
        doujin: [
          {
            id: 'x',
            title: 'X',
            thumbnail: 'x',
            lang: 'ja',
            page: 8,
            source: 'sx',
            artists: ['soso'],
            parodies: ['fate grand order'],
          },
        ],
        collections: [],
      },
    });

    const next = hydrateFavoriteMetadata(seeded, {
      type: 'ehentai-hydrate-metadata',
      id: 'x',
      artists: ['soso'],
      parodies: ['fate grand order'],
    });

    expect(next.favorite_ehentai?.doujin[0]).toMatchObject({
      artists: ['soso'],
      parodies: ['fate grand order'],
    });
  });
});
