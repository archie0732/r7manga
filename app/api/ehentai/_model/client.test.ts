import { describe, expect, test } from 'bun:test';

import { EhentaiClient, type EhentaiSearchResult } from './client';

const searchHtml = `
  <table>
    <tr>
      <td class="gl2c">
        <div class="glthumb">
          <div>
            <img src="https://ehgt.org/w/01/thumb.webp" />
          </div>
        </div>
      </td>
      <td class="glname">
        <a href="https://e-hentai.org/g/3637067/d79cdf4a79/">
          <div class="glink">Soso (NSFW Gallery)</div>
        </a>
      </td>
      <td class="gl4c glhide">
        <div>Japanese</div>
        <div>214 pages</div>
      </td>
    </tr>
  </table>
`;

const galleryPageOneHtml = `
  <div id="gd1">
    <div style="width:250px; height:353px; background:transparent url(https://ehgt.org/w/01/098/89225-lm5gq7pg.webp) 0 0 no-repeat"></div>
  </div>
  <h1 id="gn">Soso (NSFW Gallery)</h1>
  <h1 id="gj">ソソ</h1>
  <div id="gdd">
    <table>
      <tr><td class="gdt1">Language:</td><td class="gdt2">Japanese</td></tr>
      <tr><td class="gdt1">Length:</td><td class="gdt2">22 pages</td></tr>
    </table>
  </div>
  <div id="taglist">
    <table>
      <tr>
        <td class="tc">artist:</td>
        <td><div class="gtl"><a href="/tag/artist:soso">soso</a></div></td>
      </tr>
      <tr>
        <td class="tc">female:</td>
        <td><div class="gtl"><a href="/tag/female:big+breasts">big breasts</a></div></td>
      </tr>
    </table>
  </div>
  <div id="gdt" class="gt200">
    <a href="https://e-hentai.org/s/42413779d2/3637067-1"></a>
    <a href="https://e-hentai.org/s/7c83d485e6/3637067-2"></a>
  </div>
`;

const galleryPageTwoHtml = `
  <div id="gdt" class="gt200">
    <a href="https://e-hentai.org/s/8b5756672d/3637067-21"></a>
    <a href="https://e-hentai.org/s/9299f099f2/3637067-22"></a>
  </div>
`;

const imagePageHtml = `
  <div id="i3">
    <a onclick="return load_image(1, 'abcdef')">
      <img id="img" src="https://ehgt.org/abc/full-image-1.webp" style="max-width: 100%; max-height: 100%" />
    </a>
  </div>
`;

describe('EhentaiClient', () => {
  test('search parses gallery cards into website results', async () => {
    const client = new EhentaiClient(async () => new Response(searchHtml));

    const result = await client.search({ artist: 'soso' });

    expect(result).toEqual<EhentaiSearchResult[]>([
      {
        title: 'Soso (NSFW Gallery)',
        id: '3637067-d79cdf4a79',
        gid: '3637067',
        token: 'd79cdf4a79',
        thumbnail: 'https://ehgt.org/w/01/thumb.webp',
        lang: 'ja',
        page: 214,
        banTag: [],
        url: 'https://e-hentai.org/g/3637067/d79cdf4a79/',
      },
    ]);
  });

  test('getGalleryDetail fetches every thumbnail page and returns page links without resolving images', async () => {
    const calls: string[] = [];
    const client = new EhentaiClient(async (input) => {
      const url = input.toString();
      calls.push(url);

      if (url === 'https://e-hentai.org/g/3637067/d79cdf4a79/') {
        return new Response(galleryPageOneHtml);
      }

      if (url === 'https://e-hentai.org/g/3637067/d79cdf4a79/?p=1') {
        return new Response(galleryPageTwoHtml);
      }

      return new Response('not found', { status: 404 });
    });

    const result = await client.getGalleryDetail('3637067', 'd79cdf4a79');

    expect(calls).toEqual([
      'https://e-hentai.org/g/3637067/d79cdf4a79/',
      'https://e-hentai.org/g/3637067/d79cdf4a79/?p=1',
    ]);

    expect(result).toMatchObject({
      gid: '3637067',
      token: 'd79cdf4a79',
      title: 'Soso (NSFW Gallery)',
      titleJpn: 'ソソ',
      thumbnail: 'https://ehgt.org/w/01/098/89225-lm5gq7pg.webp',
      filecount: 22,
      language: 'Japanese',
      tags: ['artist:soso', 'female:big breasts'],
      pageLinks: [
        'https://e-hentai.org/s/42413779d2/3637067-1',
        'https://e-hentai.org/s/7c83d485e6/3637067-2',
        'https://e-hentai.org/s/8b5756672d/3637067-21',
        'https://e-hentai.org/s/9299f099f2/3637067-22',
      ],
      images: [],
    });
  });

  test('extractImageUrlFromPage returns the main image url', () => {
    expect(EhentaiClient.extractImageUrlFromPage(imagePageHtml)).toBe('https://ehgt.org/abc/full-image-1.webp');
  });

  test('resolveImageUrls resolves image page links into image urls', async () => {
    const client = new EhentaiClient(async (input) => {
      const url = input.toString();
      const pageNumber = url.match(/-(\d+)$/)?.[1] ?? '0';
      return new Response(imagePageHtml.replace('full-image-1', `full-image-${pageNumber}`));
    });

    const images = await client.resolveImageUrls([
      'https://e-hentai.org/s/42413779d2/3637067-1',
      'https://e-hentai.org/s/7c83d485e6/3637067-2',
    ]);

    expect(images).toEqual([
      'https://ehgt.org/abc/full-image-1.webp',
      'https://ehgt.org/abc/full-image-2.webp',
    ]);
  });
});
