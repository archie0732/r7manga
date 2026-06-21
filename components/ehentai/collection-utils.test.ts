import { describe, expect, test } from 'bun:test';

import { buildSelectedCollectionItems, moveCollectionItem } from './collection-utils';

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
});
