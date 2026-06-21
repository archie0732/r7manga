import { describe, expect, test } from 'bun:test';

import { buildCollectionReadQueue } from './collection-reader-utils';

describe('collection reader utils', () => {
  test('buildCollectionReadQueue preserves collection item order', () => {
    const queue = buildCollectionReadQueue([
      { id: 'b', title: 'Second', thumbnail: '', lang: 'ja', page: 20, source: 'https://e-hentai.org/g/2/b/' },
      { id: 'a', title: 'First', thumbnail: '', lang: 'ja', page: 10, source: 'https://e-hentai.org/g/1/a/' },
    ]);

    expect(queue.map((item) => item.id)).toEqual(['b', 'a']);
  });
});
