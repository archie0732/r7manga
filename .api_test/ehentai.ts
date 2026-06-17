import { load } from 'cheerio';

import { pickEhentaiThumb } from './ehentai-thumb';

const baseAPI = 'https://api.e-hentai.org/api.php';
const imageBaseURL = 'https://e-hentai.org/g/';
const artistURL = (artist: string) => `https://e-hentai.org/tag/artist:${artist}`;

const test = async () => {
  const response = await fetch(artistURL('soso'));

  if (!response.ok) {
    return 'response error';
  }

  const html = await response.text();
  const $ = load(html);

  const title: string[] = [];
  const url: string[] = [];
  const thumb: string[] = [];

  let counter = 0;

  $('td.glname').each((_, element) => {
    title.push($(element).find('.glink').text());
    url.push($(element).find('a').attr(('href')) ?? '');
    counter++;
  });

  $('td.gl2c').each((_, element) => {
    const image = $(element).find('.glthumb').find('div').find('img');
    thumb.push(pickEhentaiThumb({
      'src': image.attr('src'),
      'data-src': image.attr('data-src'),
      'data-lsrc': image.attr('data-lsrc'),
      'data-lazy-src': image.attr('data-lazy-src'),
    }));
  });

  return { title, url, thumb, counter };
};

const test_get_album_image = async (gallery_id: number, page_token: string, pageNumber = 1) => {
  const payload = {
    method: 'gtoken',
    pagelist: [
      [gallery_id, page_token, pageNumber],
    ],
  };

  const response = await fetch(baseAPI, { method: 'POST', body: JSON.stringify(payload) });

  if (!response.ok) {
    return '';
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json') || contentType.includes('text/html')) {
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch {
      return {
        error: 'Unexpected non-JSON response',
        contentType,
        body: text,
      };
    }
  }

  return {
    error: 'Unknown response type',
    contentType,
    body: await response.text(),
  };
};

// test().then(console.log).catch(console.error);
test_get_album_image(3637067, '42413779d2').then(console.log).catch(console.error);
// https://e-hentai.org/s/42413779d2/3637067-1
