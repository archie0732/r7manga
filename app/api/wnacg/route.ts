import { load } from 'cheerio';

import type { DoujinSearchResult } from '../nhentai/search/route';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const homeParma = z.object({
  page: z.string().nullable().refine((val) => {
    if (!val) return true;
    return /^\d+$/.test(val);
  }, {
    message: '"page" must be a numeric integer',
  }),
});

export async function GET(req: NextRequest) {
  const parama = homeParma.safeParse(
    {
      page: req.nextUrl.searchParams.get('page'),
    },
  );
  console.log('Page parameter:', req.nextUrl.searchParams.get('page'));

  if (!parama.success) {
    return Response.json(parama.error.format(), { status: 500 });
  }
  const page = parama.data?.page ?? '1';
  const url = `https://www.wnacg.com/albums-index-page-${page}.html`;

  console.log(`Server Get: ${url} and page is ${parama.data?.page}`);
  const response = await fetch(url);

  if (!response.ok) {
    return Response.json('fetch web error', { status: 500 });
  }

  const $ = load(await (response.text()));

  const doujin: DoujinSearchResult[] = [];

  $('.gallary_wrap .li.gallary_item').each((_, element) => {
    const lang = $(element).find('div').attr('class')?.split(' ')[1] === 'cate-12' ? 'ja' : 'zh';
    const title = $(element).find('a').attr('title') ?? '';
    const id = $(element).find('a').attr('href')?.split('.')[0].split('-').pop() ?? '';
    const thumbnail = 'https://' + $(element).find('img').attr('src');
    doujin.push({
      lang,
      title,
      id,
      thumbnail,
    });
  });

  return Response.json(doujin);
}
