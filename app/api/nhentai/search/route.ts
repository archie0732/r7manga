import { LRUCache } from 'lru-cache';
import { z } from 'zod';

import { fetchNhentai, langFromTagIds, listItemThumbnailUrl } from '../_model/_lib/util';

import type { NextRequest } from 'next/server';

import type { APIPaginatedSearchResultData } from '../_model/apitypes';

export interface DoujinSearchResult {
  title: string;
  id: string;
  thumbnail: string;
  banTag: string[];
  lang: 'ja' | 'zh' | 'en';
  page: number;
}

const cache = new LRUCache<string, { timestamp: number; data: DoujinSearchResult[] }>({
  max: 100,
  ttl: 60 * 1000,
});

const ParameterSchema = z.object({
  q: z.string().nullable(),
  tag: z.string().nullable(),
  parody: z.string().nullable(),
  artist: z.string().nullable(),
  character: z.string().nullable(),
  sort: z.string().nullable().refine((val) => {
    if (!val) return true;
    return ['recent', 'popular', 'popular-today', 'popular-week', 'popular-month'].includes(val);
  }, {
    message: '"sort" must be one of "recent", "popular", "popular-today", "popular-week", or "popular-month"',
  }),
  page: z.string().nullable().refine((val) => {
    if (!val) return true;
    return /^\d+$/.test(val);
  }, {
    message: '"page" must be a numeric integer',
  }),
});

const buildQuery = (type: string, v: string) => v.startsWith('-') ? `-${type}:"${v.slice(1)}"` : `${type}:"${v}"`;

const splitTerms = (value: string | null) => value?.split(',').map((v) => v.trim()).filter((v) => v.length > 0) ?? [];

export const GET = async (req: NextRequest) => {
  const queries = ParameterSchema.safeParse({
    q: req.nextUrl.searchParams.get('q'),
    tag: req.nextUrl.searchParams.get('tag'),
    character: req.nextUrl.searchParams.get('character'),
    artist: req.nextUrl.searchParams.get('artist'),
    parody: req.nextUrl.searchParams.get('parody'),
    sort: req.nextUrl.searchParams.get('sort'),
    page: req.nextUrl.searchParams.get('page'),
  });

  if (!queries.success) {
    const formatted = queries.error.format();
    return Response.json(formatted, { status: 400 });
  }

  const data = queries.data;

  const cacheKey = JSON.stringify(data);

  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && now - cached.timestamp < 60000) {
    return Response.json(cached.data);
  }

  try {
    const tag = splitTerms(data.tag);
    const artist = splitTerms(data.artist);
    const parody = splitTerms(data.parody);
    const character = splitTerms(data.character);

    const query = [
      data.q ?? '*',
      ...tag.map((v) => buildQuery('tag', v)),
      ...artist.map((v) => buildQuery('artist', v)),
      ...parody.map((v) => buildQuery('parody', v)),
      ...character.map((v) => buildQuery('character', v)),
    ].join(' ');

    const mappedSort = (queries.data.sort ?? 'popular-today').replace('recent', 'date');

    const params = new URLSearchParams({
      query,
      sort: mappedSort,
      page: queries.data.page ?? '1',
    });

    const response = await fetchNhentai(`/search?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status.toString()}: ${await response.text()}`);
    }

    const json = await response.json() as APIPaginatedSearchResultData;

    const doujinlist: DoujinSearchResult[] = [];

    for (const doujin of json.result) {
      const banTag: string[] = [];

      doujinlist.push({
        title: doujin.japanese_title ?? doujin.english_title,
        id: doujin.id.toString(),
        thumbnail: await listItemThumbnailUrl(doujin),
        banTag,
        lang: langFromTagIds(doujin.tag_ids),
        page: doujin.num_pages ?? 0,
      });
    }

    cache.set(cacheKey, { timestamp: now, data: doujinlist });

    return Response.json(doujinlist);
  }
  catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
