import { describe, expect, test } from 'bun:test';

import {
  buildCollectionReadQueue,
  buildFilteredReadQueue,
  getCollectionJumpPlan,
  shouldAutoLoadCollectionBatch,
} from './collection-reader-utils';

describe('collection reader utils', () => {
  test('buildCollectionReadQueue preserves collection item order', () => {
    const queue = buildCollectionReadQueue([
      { id: 'b', title: 'Second', thumbnail: '', lang: 'ja', page: 20, source: 'https://e-hentai.org/g/2/b/' },
      { id: 'a', title: 'First', thumbnail: '', lang: 'ja', page: 10, source: 'https://e-hentai.org/g/1/a/' },
    ]);

    expect(queue.map((item) => item.id)).toEqual(['b', 'a']);
  });

  test('buildFilteredReadQueue preserves selected id order and skips unknown items', () => {
    const queue = buildFilteredReadQueue(
      [
        { id: 'first', title: 'First', thumbnail: '', lang: 'ja', page: 10, source: 'a' },
        { id: 'second', title: 'Second', thumbnail: '', lang: 'ja', page: 20, source: 'b' },
      ],
      ['second', 'missing', 'first'],
    );

    expect(queue.map((item) => item.id)).toEqual(['second', 'first']);
  });

  test('buildFilteredReadQueue returns an empty queue when all ids are unknown', () => {
    const queue = buildFilteredReadQueue([
      { id: 'first', title: 'First', thumbnail: '', lang: 'ja', page: 10, source: 'a' },
    ], ['missing']);

    expect(queue).toEqual([]);
  });

  test('getCollectionJumpPlan advances loading to a later gallery before scrolling', () => {
    const plan = getCollectionJumpPlan([
      { id: 'first', title: 'First', thumbnail: '', lang: 'ja', page: 10, source: 'a' },
      { id: 'second', title: 'Second', thumbnail: '', lang: 'ja', page: 20, source: 'b' },
      { id: 'third', title: 'Third', thumbnail: '', lang: 'ja', page: 30, source: 'c' },
    ], 0, 'third');

    expect(plan).toEqual({
      targetIndex: 2,
      nextActiveIndex: 2,
      needsLoadingAdvance: true,
    });
  });

  test('getCollectionJumpPlan keeps current progress for an already started gallery', () => {
    const plan = getCollectionJumpPlan([
      { id: 'first', title: 'First', thumbnail: '', lang: 'ja', page: 10, source: 'a' },
      { id: 'second', title: 'Second', thumbnail: '', lang: 'ja', page: 20, source: 'b' },
    ], 1, 'first');

    expect(plan).toEqual({
      targetIndex: 0,
      nextActiveIndex: 1,
      needsLoadingAdvance: false,
    });
  });

  test('shouldAutoLoadCollectionBatch only triggers when intersecting and idle', () => {
    expect(shouldAutoLoadCollectionBatch({
      hasMore: true,
      isIntersecting: true,
      pending: false,
    })).toBe(true);

    expect(shouldAutoLoadCollectionBatch({
      hasMore: true,
      isIntersecting: false,
      pending: false,
    })).toBe(false);

    expect(shouldAutoLoadCollectionBatch({
      hasMore: true,
      isIntersecting: true,
      pending: true,
    })).toBe(false);

    expect(shouldAutoLoadCollectionBatch({
      hasMore: false,
      isIntersecting: true,
      pending: false,
    })).toBe(false);
  });
});
