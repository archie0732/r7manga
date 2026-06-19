import { z } from 'zod';

import { HentaipawClient } from '../_model/client';

import type { NextRequest } from 'next/server';

const ParameterSchema = z.object({
  q: z.string().nullable(),
  tag: z.string().nullable(),
  tagId: z.string().nullable(),
  artist: z.string().nullable(),
  artistId: z.string().nullable(),
  group: z.string().nullable(),
  groupId: z.string().nullable(),
  parody: z.string().nullable(),
  parodyId: z.string().nullable(),
  sort: z.enum(['recent', 'popular']).nullable(),
  page: z.string().nullable().refine((val) => {
    if (!val) return true;
    return /^\d+$/.test(val);
  }, {
    message: '"page" must be a numeric integer',
  }),
});

export type HentaipawSearchRouteResult = Awaited<ReturnType<HentaipawClient['search']>>;

export const GET = async (req: NextRequest) => {
  const queries = ParameterSchema.safeParse({
    q: req.nextUrl.searchParams.get('q'),
    tag: req.nextUrl.searchParams.get('tag'),
    tagId: req.nextUrl.searchParams.get('tagId'),
    artist: req.nextUrl.searchParams.get('artist'),
    artistId: req.nextUrl.searchParams.get('artistId'),
    group: req.nextUrl.searchParams.get('group'),
    groupId: req.nextUrl.searchParams.get('groupId'),
    parody: req.nextUrl.searchParams.get('parody'),
    parodyId: req.nextUrl.searchParams.get('parodyId'),
    sort: req.nextUrl.searchParams.get('sort'),
    page: req.nextUrl.searchParams.get('page'),
  });

  if (!queries.success) {
    return Response.json(queries.error.format(), { status: 400 });
  }

  try {
    const client = new HentaipawClient();
    const result = await client.search(queries.data);

    return Response.json(result);
  }
  catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
