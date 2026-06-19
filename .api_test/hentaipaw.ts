import { load } from 'cheerio';
import type { Element } from 'domhandler';

import type { Cheerio, CheerioAPI } from 'cheerio';

const BASE_URL = 'https://zh.hentaipaw.com/';
const POPULAR_URL = 'https://zh.hentaipaw.com/articles/rank';
const DOJIN_URL = 'https://zh.hentaipaw.com/articles/';
const VIEWER_URL = 'https://zh.hentaipaw.com/viewer';
const TAG_URL = 'https://zh.hentaipaw.com/tags/';
const ARTIST_URL = 'https://zh.hentaipaw.com/artists/';
const GROUP_URL = 'https://zh.hentaipaw.com/groups/';
const PARODY_URL = 'https://zh.hentaipaw.com/parodies/';
const SEARCH_URL = 'https://zh.hentaipaw.com/articles/search';

export interface PawSearchResult {
  title: string;
  thumb: string;
  url: string;
  language: string;
}

interface PawDoujinLinkValue {
  id: number | null;
  name: string;
}

export interface PawDoujinDetail {
  title: string;
  cover: string;
  author: PawDoujinLinkValue | null;
  group: PawDoujinLinkValue | null;
  parody: PawDoujinLinkValue | null;
  characters: PawDoujinLinkValue[];
  tags: PawDoujinLinkValue[];
  language: string;
  category: string;
  pages: string[];
  thumbs: string[];
}

const parseCard = ($: CheerioAPI, element: Element): PawSearchResult => {
  const titleNode = $(element).find('div[title]').first();
  const href = $(element).attr('href') ?? '';
  const thumb = $(element).find('img.h-full').attr('src') ?? '';
  const language = getLanguage($(element).find('.w-fit span').attr('class') ?? '');
  const title = titleNode.attr('title')
    ?? titleNode.text().trim()
    ?? $(element).find('img').attr('alt')?.split(',')[0]?.trim()
    ?? $(element).attr('title')
    ?? '';

  return {
    title,
    url: new URL(href, BASE_URL).href,
    thumb,
    language,
  };
};

const parseCardList = ($: CheerioAPI, elements: Cheerio<Element>) => {
  const doujins: PawSearchResult[] = [];

  elements.each((_, element) => {
    doujins.push(parseCard($, element));
  });

  return doujins;
};

const normalizeLabel = (text: string) => text.replace(/[:：\s]/g, '').trim();

const parseInfoLinks = ($: CheerioAPI, labels: string[]) => {
  const row = $('#article-tag-information .flex.flex-wrap.gap-1').filter((_, element) => {
    const heading = normalizeLabel($(element).find('h3').text());
    return labels.some((label) => heading.includes(normalizeLabel(label)));
  }).first();

  if (!row.length) {
    return [];
  }

  const linkedValues = row.find('a').map((_, element) => {
    const href = $(element).attr('href') ?? '';
    const idMatch = href.match(/\/(\d+)(?:\?|$)/);

    return {
      id: idMatch ? Number(idMatch[1]) : null,
      name: $(element).text().trim(),
    };
  }).get().filter((item) => item.name);

  if (linkedValues.length > 0) {
    return linkedValues;
  }

  return row.find('p')
    .map((_, element) => ({
      id: null,
      name: $(element).text().trim(),
    }))
    .get()
    .filter((item) => item.name);
};

const parseViewerPages = (viewerHtml: string) => {
  const matches = [...viewerHtml.matchAll(/https:\/\/cdn\.imagedeliveries\.com\/[^\s"'`]+?\.(?:webp|jpg|jpeg|png)/g)];
  return [...new Set(matches.map((match) => match[0]))];
};

const parseListingPage = (html: string) => {
  const $ = load(html);
  return parseCardList($, $('main.my-5 a.group[href]'));
};

const buildListingUrl = (baseUrl: string, id: number, type?: 'popular') =>
  `${baseUrl}${id}${type ? `?type=${type}` : ''}`;

const fetchListingPage = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    return 'error';
  }

  return parseListingPage(await response.text());
};

export const parsePopular = (html: string) => parseListingPage(html);

export const parseTag = (html: string) => parseListingPage(html);

export const parseArtist = (html: string) => parseListingPage(html);

export const parseGroup = (html: string) => parseListingPage(html);

export const parseParody = (html: string) => parseListingPage(html);

export const parseSearch = (html: string) => parseListingPage(html);

export const parseDoujin = (detailHtml: string, viewerHtml: string): PawDoujinDetail => {
  const $ = load(detailHtml);
  const title = $('#article-details h1').first().text().trim();
  const cover = $('#article-details a.group img').first().attr('src') ?? '';
  const thumbs = $('a[href*="/viewer?articleId="] img')
    .map((_, element) => $(element).attr('src') ?? '')
    .get()
    .filter((src) => src.includes('/thumbnails/') && !src.endsWith('/cover.webp'));

  return {
    title,
    cover,
    author: parseInfoLinks($, ['作者'])[0] ?? null,
    group: parseInfoLinks($, ['社團', '團體'])[0] ?? null,
    parody: parseInfoLinks($, ['原作'])[0] ?? null,
    characters: parseInfoLinks($, ['角色']),
    tags: parseInfoLinks($, ['標籤', '标签']),
    language: parseInfoLinks($, ['語言', '语言'])[0]?.name ?? 'Unknown',
    category: parseInfoLinks($, ['分類', '分类'])[0]?.name ?? '',
    pages: parseViewerPages(viewerHtml),
    thumbs,
  };
};

const getLanguage = (spanClass: string) => {
  const langMap: Record<string, string> = {
    cn: 'Chinese',
    jp: 'Japanese',
    en: 'English',
  };

  const langCode = spanClass.split(' ').find((cls) => cls.startsWith('fi-'))?.replace('fi-', '');
  return langCode ? langMap[langCode] : 'Unknown';
};

export const getPopular = async (t?: 'weekly' | 'monthly' | 'all_time') => {
  const url = t ? `${POPULAR_URL}?t=${t}` : POPULAR_URL;
  const response = await fetch(url);

  if (!response.ok) {
    return 'error';
  }

  return parsePopular(await response.text());
};

export const getDoujin = async (id: number) => {
  const detailUrl = `${DOJIN_URL}${id}`;
  const viewerUrl = `${VIEWER_URL}?articleId=${id}&page=1`;

  const [detailResponse, viewerResponse] = await Promise.all([
    fetch(detailUrl),
    fetch(viewerUrl),
  ]);

  if (!detailResponse.ok || !viewerResponse.ok) {
    return 'error';
  }

  return parseDoujin(
    await detailResponse.text(),
    await viewerResponse.text(),
  );
};

export const getTag = async (id: number, type?: 'popular') =>
  fetchListingPage(buildListingUrl(TAG_URL, id, type));

export const getArtist = async (id: number, type?: 'popular') =>
  fetchListingPage(buildListingUrl(ARTIST_URL, id, type));

export const getGroup = async (id: number, type?: 'popular') =>
  fetchListingPage(buildListingUrl(GROUP_URL, id, type));

export const getParody = async (id: number, type?: 'popular') =>
  fetchListingPage(buildListingUrl(PARODY_URL, id, type));

export const getSearch = async (keyword: string) => {
  const url = `${SEARCH_URL}?keyword=${encodeURIComponent(keyword)}`;
  return fetchListingPage(url);
};

if (import.meta.main) {
  getDoujin(3407674).then(console.log).catch(console.error);
}
