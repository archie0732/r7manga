import { describe, expect, test } from 'bun:test';

import { shouldAutoLoadEhentaiBatch } from './ehentai-reader-utils';

describe('ehentai reader utils', () => {
  test('auto-load triggers only when more pages remain, the sentinel is visible, and no request is pending', () => {
    expect(shouldAutoLoadEhentaiBatch({
      hasMore: true,
      isIntersecting: true,
      pending: false,
    })).toBe(true);

    expect(shouldAutoLoadEhentaiBatch({
      hasMore: false,
      isIntersecting: true,
      pending: false,
    })).toBe(false);

    expect(shouldAutoLoadEhentaiBatch({
      hasMore: true,
      isIntersecting: false,
      pending: false,
    })).toBe(false);

    expect(shouldAutoLoadEhentaiBatch({
      hasMore: true,
      isIntersecting: true,
      pending: true,
    })).toBe(false);
  });
});
