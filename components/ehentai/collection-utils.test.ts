import { describe, expect, test } from 'bun:test';

import {
  buildCollectionPreviewCovers,
  buildEhentaiFilterOptions,
  buildSelectedCollectionItems,
  filterEhentaiFavorites,
  findFavoritesMissingEhentaiMetadata,
  moveCollectionItem,
} from './collection-utils';

describe('ehentai collection utils', () => {
  test('buildSelectedCollectionItems preserves selection order from favorite ids', () => {
    expect(buildSelectedCollectionItems(
      [
        { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 10, source: 'a' },
        { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 20, source: 'b' },
      ],
      ['2', '1'],
    ).map((item) => item.id)).toEqual(['2', '1']);
  });

  test('moveCollectionItem swaps item order upward and downward', () => {
    const items = [
      { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 10, source: 'a' },
      { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 20, source: 'b' },
      { id: '3', title: 'Three', thumbnail: '3', lang: 'ja', page: 30, source: 'c' },
    ];

    expect(moveCollectionItem(items, 2, 'up').map((item) => item.id)).toEqual(['1', '3', '2']);
    expect(moveCollectionItem(items, 0, 'down').map((item) => item.id)).toEqual(['2', '1', '3']);
  });

  test('buildEhentaiFilterOptions groups artist and parody counts from saved favorites', () => {
    const options = buildEhentaiFilterOptions([
      { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 10, artists: ['soso'], parodies: ['fate'] },
      { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 12, artists: ['soso', 'mashu'], parodies: ['fate'] },
      { id: '3', title: 'Three', thumbnail: '3', lang: 'ja', page: 14, artists: ['mashu'], parodies: ['blue archive'] },
    ]);

    expect(options.artists).toEqual([
      { value: 'mashu', count: 2 },
      { value: 'soso', count: 2 },
    ]);
    expect(options.parodies).toEqual([
      { value: 'blue archive', count: 1 },
      { value: 'fate', count: 2 },
    ]);
  });

  test('filterEhentaiFavorites uses OR within group and AND across groups', () => {
    const favorites = [
      { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 10, artists: ['soso'], parodies: ['fate'] },
      { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 12, artists: ['mashu'], parodies: ['fate'] },
      { id: '3', title: 'Three', thumbnail: '3', lang: 'ja', page: 14, artists: ['mashu'], parodies: ['blue archive'] },
    ];

    expect(filterEhentaiFavorites(favorites, {
      artists: ['soso', 'mashu'],
      parodies: ['fate'],
    }).map((item) => item.id)).toEqual(['1', '2']);
  });

  test('filterEhentaiFavorites excludes missing metadata items when filters are active', () => {
    const favorites = [
      { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 10 },
      { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 12, artists: ['soso'], parodies: ['fate'] },
    ];

    expect(filterEhentaiFavorites(favorites, {
      artists: ['soso'],
      parodies: [],
    }).map((item) => item.id)).toEqual(['2']);
  });

  test('buildCollectionPreviewCovers returns up to four thumbnails in item order', () => {
    expect(buildCollectionPreviewCovers([
      { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 1 },
      { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 1 },
      { id: '3', title: 'Three', thumbnail: '3', lang: 'ja', page: 1 },
      { id: '4', title: 'Four', thumbnail: '4', lang: 'ja', page: 1 },
      { id: '5', title: 'Five', thumbnail: '5', lang: 'ja', page: 1 },
    ])).toEqual(['1', '2', '3', '4']);
  });

  test('findFavoritesMissingEhentaiMetadata returns only works without both metadata arrays', () => {
    expect(findFavoritesMissingEhentaiMetadata([
      { id: '1', title: 'One', thumbnail: '1', lang: 'ja', page: 1 },
      { id: '2', title: 'Two', thumbnail: '2', lang: 'ja', page: 1, artists: ['soso'], parodies: ['fate'] },
      { id: '3', title: 'Three', thumbnail: '3', lang: 'ja', page: 1, artists: [], parodies: [] },
    ]).map((item) => item.id)).toEqual(['1']);
  });
});
