import { describe, expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';

import { EhentaiPageImage } from './page-image';

describe('EhentaiPageImage', () => {
  test('renders a native lazy img without hard-coded dimensions', () => {
    const html = renderToStaticMarkup(
      <EhentaiPageImage
        src="https://example.com/page-1.webp"
        alt="page-1"
        title="https://example.com/page-1.webp"
      />,
    );

    expect(html).toContain('<img');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
    expect(html).toContain('class="block h-auto w-full max-w-5xl"');
    expect(html).not.toContain('width=');
    expect(html).not.toContain('height=');
  });
});
