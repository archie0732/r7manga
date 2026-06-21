import { load } from 'cheerio';

import { extractStyleUrl, pickEhentaiThumb } from './thumb';

export interface EhentaiSearchResult {
  title: string;
  id: string;
  gid: string;
  token: string;
  thumbnail: string;
  banTag: string[];
  lang: 'ja' | 'zh' | 'en';
  page: number;
  url: string;
}

export interface EhentaiSearchPage {
  results: EhentaiSearchResult[];
  next?: string | null;
}

export const EHENTAI_IMAGE_BATCH_SIZE = 5;

export interface EhentaiGalleryDetail {
  id: string;
  gid: string;
  token: string;
  url: string;
  title: string;
  titleJpn: string;
  thumbnail: string;
  category: string;
  language: string;
  filecount: number;
  tags: string[];
  pageLinks: string[];
  images: string[];
}

type FetchImpl = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

type SearchParams = {
  q?: string | null;
  artist?: string | null;
  tag?: string | null;
  page?: string | number | null;
  next?: string | null;
};

const SEARCH_ROOT = 'https://e-hentai.org/';

const toLang = (value: string): 'ja' | 'zh' | 'en' => {
  const normalized = value.toLowerCase();

  if (normalized.includes('japanese')) {
    return 'ja';
  }

  if (normalized.includes('chinese')) {
    return 'zh';
  }

  return 'en';
};

const parseGalleryUrl = (url: string) => {
  const match = url.match(/\/g\/(\d+)\/([a-z0-9]+)\//i);

  if (!match) {
    throw new Error(`Invalid gallery url: ${url}`);
  }

  return {
    gid: match[1],
    token: match[2],
    id: `${match[1]}-${match[2]}`,
  };
};

const parsePageCount = (value: string) => Number.parseInt(value.match(/(\d+)/)?.[1] ?? '0', 10);
const extractPagesCount = (value: string) => Number.parseInt(value.match(/(\d+)\s+pages\b/i)?.[1] ?? '0', 10);

const joinEhentaiUrl = (url: string) => new URL(url, SEARCH_ROOT).toString();

const buildSearchQuery = ({ q, artist, tag }: SearchParams) => {
  const terms = [
    q?.trim(),
    artist?.trim() ? `artist:${artist.trim()}` : null,
    tag?.trim() ? `tag:${tag.trim()}` : null,
  ].filter((value): value is string => Boolean(value));

  return terms.join(' ').trim() || '*';
};

export const extractNextToken = (html: string) => {
  const $ = load(html);

  const candidate = $('a')
    .map((_, link) => $(link).attr('href') ?? '')
    .get()
    .find((href) => href.includes('/tag/') && href.includes('next=') || href.startsWith('?next=') || href.includes('&next='));

  if (!candidate) {
    return null;
  }

  return new URL(candidate, SEARCH_ROOT).searchParams.get('next');
};

export const buildSearchUrl = (params: SearchParams) => {
  const url = new URL(SEARCH_ROOT);
  url.searchParams.set('f_search', buildSearchQuery(params));

  if (params.next?.trim()) {
    url.searchParams.set('next', params.next.trim());
    return url.toString();
  }

  if (params.page && params.page.toString() !== '1') {
    url.searchParams.set('page', params.page.toString());
  }

  return url.toString();
};

export const parseSearchResults = (html: string): EhentaiSearchResult[] => {
  const $ = load(html);
  const items: EhentaiSearchResult[] = [];

  $('tr').each((_, row) => {
    const link = $(row).find('td.glname a').first();
    const href = link.attr('href');

    if (!href) {
      return;
    }

    const title = link.find('.glink').text().trim() || link.text().trim();

    if (!title) {
      return;
    }

    const { gid, token, id } = parseGalleryUrl(href);
    const image = $(row).find('td.gl2c .glthumb img').first();
    const thumb = pickEhentaiThumb({
      src: image.attr('src'),
      'data-src': image.attr('data-src'),
      'data-lsrc': image.attr('data-lsrc'),
      'data-lazy-src': image.attr('data-lazy-src'),
    });

    const pageLabel = $(row)
      .find('div')
      .toArray()
      .filter((element) => $(element).children('div').length === 0)
      .map((element) => $(element).text().trim())
      .find((text) => /\bpages\b/i.test(text))
      ?? $(row).find('td.gl4c').text();
    const page = extractPagesCount(pageLabel) || parsePageCount(pageLabel);
    const langText = $(row).text();

    items.push({
      title,
      id,
      gid,
      token,
      thumbnail: thumb,
      lang: toLang(langText),
      page,
      banTag: [],
      url: joinEhentaiUrl(href),
    });
  });

  return items;
};

export const parseGalleryDetailPage = (
  html: string,
  gid: string,
  token: string,
): Omit<EhentaiGalleryDetail, 'images'> => {
  const $ = load(html);
  const title = $('#gn').first().text().trim();
  const titleJpn = $('#gj').first().text().trim();
  const thumbnail = extractStyleUrl($('#gd1 > div').attr('style'));
  const category = $('#gdc .cs').first().text().trim();

  let language = '';
  let filecount = 0;

  $('#gdd tr').each((_, row) => {
    const key = $(row).find('.gdt1').text().trim();
    const value = $(row).find('.gdt2').text().trim();

    if (key === 'Language:') {
      language = value.replace(/\s+/g, ' ').trim();
    }

    if (key === 'Length:') {
      filecount = parsePageCount(value);
    }
  });

  const tags: string[] = [];
  $('#taglist tr').each((_, row) => {
    const namespace = $(row).find('.tc').first().text().trim().replace(/:$/, '');
    $(row).find('a').each((__, link) => {
      const label = $(link).text().trim();

      if (namespace && label) {
        tags.push(`${namespace}:${label}`);
      }
    });
  });

  const pageLinks = $('#gdt a')
    .map((_, link) => joinEhentaiUrl($(link).attr('href') ?? ''))
    .get()
    .filter(Boolean);

  return {
    id: `${gid}-${token}`,
    gid,
    token,
    url: `https://e-hentai.org/g/${gid}/${token}/`,
    title,
    titleJpn,
    thumbnail,
    category,
    language,
    filecount,
    tags,
    pageLinks,
  };
};

export const extractImageUrlFromPage = (html: string) => {
  const $ = load(html);
  return $('#img').attr('src')?.trim() ?? '';
};

export class EhentaiClient {
  static extractImageUrlFromPage(html: string) {
    return extractImageUrlFromPage(html);
  }

  constructor(private readonly fetchImpl: FetchImpl = fetch) {}

  async search(params: SearchParams): Promise<EhentaiSearchResult[]> {
    const targetPage = Math.max(1, Number.parseInt(params.page?.toString() ?? '1', 10) || 1);
    let currentPage = 1;
    let nextToken = params.next?.trim() || null;
    let response = await this.fetchImpl(buildSearchUrl({ ...params, page: currentPage, next: nextToken }));

    if (!response.ok) {
      throw new Error(`E-Hentai search failed: ${response.status.toString()} ${await response.text()}`);
    }

    let html = await response.text();

    while (currentPage < targetPage) {
      nextToken = extractNextToken(html);

      if (!nextToken) {
        break;
      }

      currentPage += 1;
      response = await this.fetchImpl(buildSearchUrl({ ...params, next: nextToken }));

      if (!response.ok) {
        throw new Error(`E-Hentai search failed: ${response.status.toString()} ${await response.text()}`);
      }

      html = await response.text();
    }

    return parseSearchResults(html);
  }

  async getGalleryDetail(gid: string, token: string): Promise<EhentaiGalleryDetail> {
    const baseUrl = `https://e-hentai.org/g/${gid}/${token}/`;
    const response = await this.fetchImpl(baseUrl);

    if (!response.ok) {
      throw new Error(`E-Hentai gallery failed: ${response.status.toString()} ${await response.text()}`);
    }

    const firstPageHtml = await response.text();
    const detail = parseGalleryDetailPage(firstPageHtml, gid, token);
    const pageLinks = [...detail.pageLinks];
    const thumbnailPageCount = Math.ceil(detail.filecount / 20);

    for (let pageIndex = 1; pageIndex < thumbnailPageCount; pageIndex++) {
      const pageUrl = `${baseUrl}?p=${pageIndex.toString()}`;
      const pageResponse = await this.fetchImpl(pageUrl);

      if (!pageResponse.ok) {
        throw new Error(`E-Hentai gallery page failed: ${pageResponse.status.toString()} ${await pageResponse.text()}`);
      }

      const pageHtml = await pageResponse.text();
      const pageDetail = parseGalleryDetailPage(pageHtml, gid, token);
      pageLinks.push(...pageDetail.pageLinks);
    }

    return {
      ...detail,
      pageLinks: [...new Set(pageLinks)],
      images: [],
    };
  }

  async resolveImageUrls(pageLinks: string[]): Promise<string[]> {
    const images: string[] = [];

    for (const pageLink of [...new Set(pageLinks)]) {
      const imageResponse = await this.fetchImpl(pageLink);

      if (!imageResponse.ok) {
        throw new Error(`E-Hentai image page failed: ${imageResponse.status.toString()} ${await imageResponse.text()}`);
      }

      const imageUrl = extractImageUrlFromPage(await imageResponse.text());

      if (imageUrl) {
        images.push(imageUrl);
      }
    }

    return images;
  }
}
