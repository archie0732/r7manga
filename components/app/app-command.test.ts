import { describe, expect, test } from 'bun:test';

import { buildCommandSearchTarget, commandNavigationItems } from './app-command';

describe('commandNavigationItems', () => {
  test('keeps only the home navigation shortcut in the command palette', () => {
    expect(commandNavigationItems).toHaveLength(1);
    expect(commandNavigationItems[0]).toMatchObject({
      label: 'Home',
      href: '/',
    });
  });
});

describe('buildCommandSearchTarget', () => {
  test('routes keyword search to nhentai search by default', () => {
    expect(buildCommandSearchTarget('soso', 'nhentai')).toBe('/search?q=soso');
  });

  test('routes keyword search to ehentai search when website is ehentai', () => {
    expect(buildCommandSearchTarget('soso', 'ehentai')).toBe('/search?q=soso&w=e');
  });

  test('routes keyword search to hentaipaw page when website is hentaipaw', () => {
    expect(buildCommandSearchTarget('soso', 'hentaipaw')).toBe('/p?q=soso');
  });

  test('routes numeric keyword directly to nhentai detail page', () => {
    expect(buildCommandSearchTarget('12345', 'ehentai')).toBe('/n/12345');
  });
});
