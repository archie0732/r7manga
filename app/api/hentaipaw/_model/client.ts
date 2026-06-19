import axios from 'axios';
import { load } from 'cheerio';
import type { Element } from 'domhandler';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import type { Cheerio, CheerioAPI } from 'cheerio';

type Fetcher = typeof fetch;
const execFileAsync = promisify(execFile);

const BASE_URL = 'https://zh.hentaipaw.com';
const LATEST_SECTION_TITLE = '最新的H漫・色情同人本';

export const HENTAIPAW_HEADERS = {
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'accept-language': 'zh-TW,zh;q=0.9,en;q=0.8',
  'cache-control': 'no-cache',
  pragma: 'no-cache',
  referer: `${BASE_URL}/`,
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
} as const;

export interface HentaipawSearchResult {
  title: string;
  id: string;
  thumbnail: string;
  banTag: string[];
  lang: 'ja' | 'zh' | 'en';
  page: number;
}

export interface HentaipawTag {
  id: number | null;
  type: 'tag' | 'artist' | 'group' | 'parody' | 'character' | 'language' | 'category';
  name: string;
  url: string;
}

export interface HentaipawDoujin {
  id: string;
  title: string;
  cover: string;
  lang: 'ja' | 'zh' | 'en';
  languageLabel: string;
  category: string;
  artists: HentaipawTag[];
  groups: HentaipawTag[];
  parody: HentaipawTag[];
  characters: HentaipawTag[];
  tags: HentaipawTag[];
  thumbnails: string[];
  pages: string[];
}

export type HentaipawListQuery = {
  q?: string | null;
  tag?: string | null;
  tagId?: string | null;
  artist?: string | null;
  artistId?: string | null;
  group?: string | null;
  groupId?: string | null;
  parody?: string | null;
  parodyId?: string | null;
  sort?: string | null;
  page?: string | null;
};

const labelMap = {
  artist: ['作者'],
  group: ['社團', '組織', '圈子'],
  parody: ['原作'],
  character: ['角色'],
  tag: ['標籤', '标签'],
  language: ['語言', '语言'],
  category: ['分類', '类别'],
} satisfies Record<HentaipawTag['type'], string[]>;

const normalizeLabel = (text: string) => text.replace(/[:：\s]/g, '').trim();

const encodeSearchLink = (type: string, id: number | null, name: string) => {
  if (id === null || type === 'character') {
    return '';
  }

  const params = new URLSearchParams({
    [`${type}Id`]: id.toString(),
    [type]: name,
  });

  return `/p?${params.toString()}`;
};

const getLanguageFromFlag = (spanClass: string) => {
  const code = spanClass.split(' ').find((cls) => cls.startsWith('fi-'))?.replace('fi-', '');
  if (code === 'cn') return 'Chinese';
  if (code === 'jp') return 'Japanese';
  if (code === 'en') return 'English';
  return 'Unknown';
};

export const mapHentaipawLanguage = (language: string): 'ja' | 'zh' | 'en' => {
  if (language === 'Chinese') return 'zh';
  if (language === 'Japanese') return 'ja';
  return 'en';
};

export const shouldUseLocalBunFallback = (env: NodeJS.ProcessEnv = process.env) => {
  return env.VERCEL !== '1' && env.VERCEL !== 'true';
};

const parseCard = ($: CheerioAPI, element: Element): HentaipawSearchResult => {
  const card = $(element);
  const href = card.attr('href') ?? '';
  const id = href.match(/\/articles\/(\d+)/)?.[1] ?? '';
  const titleNode = card.find('div[title]').first();
  const title = titleNode.attr('title')
    ?? titleNode.text().trim()
    ?? card.find('img').attr('alt')?.split(',')[0]?.trim()
    ?? '';
  const langLabel = getLanguageFromFlag(card.find('.w-fit span').attr('class') ?? '');

  return {
    title,
    id,
    thumbnail: card.find('img.h-full').attr('src') ?? '',
    banTag: [],
    lang: mapHentaipawLanguage(langLabel),
    page: 0,
  };
};

const parseCardList = ($: CheerioAPI, elements: Cheerio<Element>) => {
  const results: HentaipawSearchResult[] = [];

  elements.each((_, element) => {
    results.push(parseCard($, element));
  });

  return results;
};

const parseListingPage = (html: string) => {
  const $ = load(html);
  return parseCardList($, $('main.my-5 a.group[href]'));
};

const parseHomePage = (html: string) => {
  const $ = load(html);
  const latestHeading = $('main.my-5 h1, main.my-5 h2').filter((_, element) =>
    $(element).text().includes(LATEST_SECTION_TITLE),
  ).first();
  const latestGrid = latestHeading.nextAll('div.grid.grid-cols-2').first();

  if (latestGrid.length > 0) {
    return parseCardList($, latestGrid.find('a.group[href]'));
  }

  return parseCardList($, $('main.my-5 a.group[href]'));
};

const parseInfoLinks = ($: CheerioAPI, type: HentaipawTag['type']) => {
  const labels = labelMap[type].map(normalizeLabel);
  const row = $('#article-tag-information .flex.flex-wrap.gap-1').filter((_, element) => {
    const text = normalizeLabel($(element).find('h3').text());
    return labels.some((label) => text.includes(label));
  }).first();

  if (!row.length) {
    return [];
  }

  const linkValues = row.find('a').map((_, element) => {
    const node = $(element);
    const href = node.attr('href') ?? '';
    const id = href.match(/\/(\d+)(?:\?|$)/)?.[1];
    const name = node.text().trim();

    return {
      id: id ? Number(id) : null,
      type,
      name,
      url: encodeSearchLink(type, id ? Number(id) : null, name),
    } satisfies HentaipawTag;
  }).get().filter((item) => item.name.length > 0);

  if (linkValues.length > 0) {
    return linkValues;
  }

  return row.find('p').map((_, element) => ({
    id: null,
    type,
    name: $(element).text().trim(),
    url: '',
  } satisfies HentaipawTag)).get().filter((item) => item.name.length > 0);
};

const parseViewerPages = (html: string) => {
  const matches = [...html.matchAll(/https:\/\/cdn\.imagedeliveries\.com\/[^\s"'`]+?\.(?:webp|jpg|jpeg|png)/g)];
  return [...new Set(matches.map((match) => match[0]))];
};

const fallbackFetchHtml = async (url: string) => {
  const script = `
    const url = process.env.R7_HENTAIPAW_URL;
    if (!url) process.exit(3);
    const response = await fetch(url);
    if (!response.ok) process.exit(2);
    process.stdout.write(await response.text());
  `;

  const { stdout } = await execFileAsync('bun', ['-e', script], {
    maxBuffer: 8 * 1024 * 1024,
    env: {
      ...process.env,
      R7_HENTAIPAW_URL: url,
    },
  });

  return stdout;
};

const fetchHtml = async (fetcher: Fetcher, url: string) => {
  try {
    const response = await fetcher(url, {
      headers: HENTAIPAW_HEADERS,
    });

    if (response.ok) {
      return await response.text();
    }

    if (response.status !== 403) {
      throw new Error(`Hentaipaw fetch failed: ${response.status.toString()}`);
    }
  }
  catch (error) {
    if (!(error instanceof Error) || !/403|fetch failed/i.test(error.message)) {
      throw error;
    }
  }

  try {
    const response = await axios.get<string>(url, {
      headers: HENTAIPAW_HEADERS,
      responseType: 'text',
      timeout: 15_000,
      validateStatus: () => true,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
  }
  catch (error) {
    if (!(error instanceof Error)) {
      throw error;
    }
  }

  if (!shouldUseLocalBunFallback()) {
    throw new Error('Hentaipaw fetch blocked upstream and local Bun fallback is unavailable on Vercel.');
  }

  return fallbackFetchHtml(url);
};

export const buildListingQuery = (query: HentaipawListQuery) => {
  const page = query.page ? `page=${query.page}` : '';
  const type = query.sort === 'popular' ? 'type=popular' : '';
  const suffix = [page, type].filter(Boolean).join('&');
  const searchSuffix = suffix ? `?${suffix}` : '';

  if (query.tagId) return `/tags/${query.tagId}${searchSuffix}`;
  if (query.artistId) return `/artists/${query.artistId}${searchSuffix}`;
  if (query.groupId) return `/groups/${query.groupId}${searchSuffix}`;
  if (query.parodyId) return `/parodies/${query.parodyId}${searchSuffix}`;

  if (query.q && query.q !== '*') {
    const params = new URLSearchParams();
    params.set('keyword', query.q);
    if (query.page) params.set('page', query.page);
    if (query.sort === 'popular') params.set('type', 'popular');
    return `/articles/search?${params.toString()}`;
  }

  return `/${searchSuffix}`;
};

export class HentaipawClient {
  constructor(private readonly fetcher: Fetcher = fetch) {}

  parseListingPage(html: string) {
    return parseListingPage(html);
  }

  parseHomePage(html: string) {
    return parseHomePage(html);
  }

  async search(query: HentaipawListQuery) {
    const html = await fetchHtml(this.fetcher, `${BASE_URL}${buildListingQuery(query)}`);
    const isHomeQuery = !query.q && !query.tagId && !query.artistId && !query.groupId && !query.parodyId;

    return isHomeQuery ? parseHomePage(html) : parseListingPage(html);
  }

  async getDoujinDetail(id: string): Promise<HentaipawDoujin> {
    const [detailHtml, viewerHtml] = await Promise.all([
      fetchHtml(this.fetcher, `${BASE_URL}/articles/${id}`),
      fetchHtml(this.fetcher, `${BASE_URL}/viewer?articleId=${id}&page=1`),
    ]);
    const $ = load(detailHtml);
    const languageLabel = parseInfoLinks($, 'language')[0]?.name ?? 'Unknown';

    return {
      id,
      title: $('#article-details h1').first().text().trim(),
      cover: $('#article-details a.group img').first().attr('src') ?? '',
      lang: mapHentaipawLanguage(languageLabel),
      languageLabel,
      category: parseInfoLinks($, 'category')[0]?.name ?? '',
      artists: parseInfoLinks($, 'artist'),
      groups: parseInfoLinks($, 'group'),
      parody: parseInfoLinks($, 'parody'),
      characters: parseInfoLinks($, 'character'),
      tags: parseInfoLinks($, 'tag'),
      thumbnails: $('a[href*="/viewer?articleId="] img').map((_, element) => $(element).attr('src') ?? '').get().filter(Boolean),
      pages: parseViewerPages(viewerHtml),
    };
  }
}
