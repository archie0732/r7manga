import { z } from 'zod';

import { EhentaiClient } from '../_model/client';

import type { NextRequest } from 'next/server';

const ParameterSchema = z.object({
  q: z.string().nullable(),
  artist: z.string().nullable(),
  parody: z.string().nullable(),
  tag: z.string().nullable(),
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
    artist: req.nextUrl.searchParams.get('artist'),
    parody: req.nextUrl.searchParams.get('parody'),
    tag: req.nextUrl.searchParams.get('tag'),
    page: req.nextUrl.searchParams.get('page'),
  });

  if (!queries.success) {
    return Response.json(queries.error.format(), { status: 400 });
  }

  try {
    const client = new EhentaiClient();
    const result = await client.search(queries.data);

    return Response.json(result);
  }
  catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
