import { describe, expect, test } from 'bun:test';

import { normalizeTagUrls, toLocalTagUrl } from './route';

describe('nhentai doujin route tag urls', () => {
  test('rewrites parody and tag links to local search routes', () => {
    expect(toLocalTagUrl({
      id: 1,
      type: 'parody',
      name: 'fate grand order',
      url: '/parody/fate-grand-order/',
      count: 100,
    })).toBe('/search?parody=fate+grand+order');

    expect(toLocalTagUrl({
      id: 2,
      type: 'tag',
      name: 'big breasts',
      url: '/tag/big-breasts/',
      count: 200,
    })).toBe('/search?tag=big+breasts');
  });

  test('rewrites artist and character links to local search routes', () => {
    expect(normalizeTagUrls([
      {
        id: 3,
        type: 'artist',
        name: 'soso',
        url: '/artist/soso/',
        count: 50,
      },
      {
        id: 4,
        type: 'character',
        name: 'mash kyrielight',
        url: '/character/mash-kyrielight/',
        count: 70,
      },
    ])).toEqual([
      {
        id: 3,
        type: 'artist',
        name: 'soso',
        url: '/search?artist=soso',
        count: 50,
      },
      {
        id: 4,
        type: 'character',
        name: 'mash kyrielight',
        url: '/search?character=mash+kyrielight',
        count: 70,
      },
    ]);
  });
});
