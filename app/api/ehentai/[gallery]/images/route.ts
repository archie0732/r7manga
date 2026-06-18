import { z } from 'zod';

import { EhentaiClient } from '../../_model/client';

const ParamSchema = z.object({
  gallery: z.string().regex(/^\d+-[a-z0-9]+$/i),
});

const QuerySchema = z.object({
  start: z.coerce.number().int().min(0).default(0),
  count: z.coerce.number().int().min(1).max(20).default(10),
});

type Props = Readonly<{
  params: Promise<{
    gallery: string;
  }>;
}>;

export const GET = async (req: Request, { params }: Props) => {
  const parsedParams = ParamSchema.safeParse(await params);

  if (!parsedParams.success) {
    return Response.json(parsedParams.error.format(), { status: 400 });
  }

  const requestUrl = new URL(req.url);
  const parsedQuery = QuerySchema.safeParse({
    start: requestUrl.searchParams.get('start') ?? '0',
    count: requestUrl.searchParams.get('count') ?? '10',
  });

  if (!parsedQuery.success) {
    return Response.json(parsedQuery.error.format(), { status: 400 });
  }

  try {
    const [gid, token] = parsedParams.data.gallery.split('-');
    const client = new EhentaiClient();
    const detail = await client.getGalleryDetail(gid, token);
    const slice = detail.pageLinks.slice(parsedQuery.data.start, parsedQuery.data.start + parsedQuery.data.count);
    const images = await client.resolveImageUrls(slice);

    return Response.json({
      start: parsedQuery.data.start,
      count: images.length,
      total: detail.pageLinks.length,
      images,
    });
  }
  catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
