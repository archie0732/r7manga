import { NextRequest } from 'next/server';
import { toThumbnailUrl } from '../_model/_lib/util';

import type { APISearchResultData } from '../_model/apitypes';
import { z } from 'zod';

export interface DoujinSearchResult {
  title: string;
  id: string;
  thumbnail: string;
  lang: 'ja' | 'zh' | 'en';
}

export const languageMap: Partial<Record<string, 'ja' | 'zh' | 'en'>> = {
  6346: 'ja',
  29963: 'zh',
  12227: 'en',
};

const ParameterSchema = z.object({
  q: z.string().min(1),
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

export const GET = async (req: NextRequest) => {
  const queries = ParameterSchema.safeParse({
    q: req.nextUrl.searchParams.get('q'),
    sort: req.nextUrl.searchParams.get('sort'),
    page: req.nextUrl.searchParams.get('page'),
  });

  if (!queries.success) {
    const formatted = queries.error.format();

    return Response.json(formatted, {
      status: 400,
    });
  }

  try {
    const params = new URLSearchParams({
      query: queries.data.q,
      sort: queries.data.sort ?? 'popular-today',
      page: queries.data.page ?? '1',
    });

    const response = await fetch(`https://nhentai.net/api/galleries/search?${params.toString()}`);

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
