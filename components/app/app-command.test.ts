import { describe, expect, test } from 'bun:test';

import { buildCommandSearchTarget } from './app-command';

describe('buildCommandSearchTarget', () => {
  test('routes keyword search to nhentai search by default', () => {
    expect(buildCommandSearchTarget('soso', 'nhentai')).toBe('/search?q=soso');
  });

  test('routes keyword search to ehentai search when website is ehentai', () => {
    expect(buildCommandSearchTarget('soso', 'ehentai')).toBe('/search?q=soso&w=e');
  });

  test('routes numeric keyword directly to nhentai detail page', () => {
    expect(buildCommandSearchTarget('12345', 'ehentai')).toBe('/n/12345');
  });
});
