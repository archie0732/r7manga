import { NextRequest } from 'next/server';
import { toThumbnailUrl } from '../_model/_lib/util';
import { languageMap } from '../_model/_lib/util';

import type { APISearchResultData } from '../_model/apitypes';
import { z } from 'zod';

export interface DoujinSearchResult {
  title: string;
  id: string;
  thumbnail: string;
  lang: 'ja' | 'zh' | 'en';
}

const ParameterSchema = z.object({
  q: z.string().nullable(),
  tag: z.string().nullable(),
  parody: z.string().nullable(),
  artist: z.string().nullable(),
  character: z.string().nullable(),
  sort: z.string().nullable().refine((val) => {
    if (!val) return true;
    return ['recent', 'popular', 'popular-today', 'popular-week'].includes(val);
  }, {
    message: '"sort" must be one of "recent", "popular", "popular-today", or "popular-week"',
  }),
  page: z.string().nullable().refine((val) => {
    if (!val) return true;
    return /^\d+$/.test(val);
  }, {
    message: '"page" must be a numeric integer',
  }),
});

const buildQuery = (type: string, v: string) => v.startsWith('-') ? `-${type}:"${v.slice(1)}"` : `${type}:"${v}"`;

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

    return Response.json(formatted, {
      status: 400,
    });
  }

  const data = queries.data;

  try {
    const tag = data.tag?.split(',') ?? [];
    const artist = data.artist?.split(',') ?? [];
    const parody = data.parody?.split(',') ?? [];
    const character = data.character?.split(',') ?? [];

    const query = [
      data.q ?? '*',
      ...tag.map((v) => buildQuery('tag', v)),
      ...artist.map((v) => buildQuery('artist', v)),
      ...parody.map((v) => buildQuery('parody', v)),
      ...character.map((v) => buildQuery('character', v)),
    ].join(' ');

    const params = new URLSearchParams({
      query: query,
      sort: queries.data.sort ?? 'popular-today',
      page: queries.data.page ?? '1',
    });

    const url = `https://nhentai.net/api/galleries/search?${params.toString()}`;

    console.log('Server fetch url: ', url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status.toString()}: ${await response.text()}`);
    }

    const json = await response.json() as APISearchResultData;

    const doujinlist: DoujinSearchResult[] = [];

    for (const doujin of json.result) {
      const langTag = doujin.tags.find((t) => t.type == 'language');

      doujinlist.push({
        title: doujin.title.japanese ?? doujin.title.english,
        id: doujin.id.toString(),
        thumbnail: toThumbnailUrl(doujin),
        lang: langTag ? languageMap[langTag.id] ?? 'ja' : 'ja',
      });
    }

    return Response.json(doujinlist);
  }
  catch (error) {
    console.error(error);

    return new Response('Internal Server Error', {
      status: 500,
    });
  }
};
