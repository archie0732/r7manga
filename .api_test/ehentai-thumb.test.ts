import { describe, expect, test } from 'bun:test';

import { PLACEHOLDER_GIF, pickEhentaiThumb } from './ehentai-thumb';

describe('pickEhentaiThumb', () => {
  test('prefers data-src when src is the 1x1 placeholder gif', () => {
    const thumb = pickEhentaiThumb({
      src: PLACEHOLDER_GIF,
      'data-src': 'https://ehgt.org/w/01/098/89225-lm5gq7pg.webp',
    });

    expect(thumb).toBe('https://ehgt.org/w/01/098/89225-lm5gq7pg.webp');
  });

  test('keeps src when it already points to a real image', () => {
    const thumb = pickEhentaiThumb({
      src: 'https://ehgt.org/w/02/366/06311-1nk3rqqc.webp',
      'data-src': 'https://ehgt.org/w/01/098/89225-lm5gq7pg.webp',
    });

    expect(thumb).toBe('https://ehgt.org/w/02/366/06311-1nk3rqqc.webp');
  });
});
