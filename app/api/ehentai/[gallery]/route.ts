import { z } from 'zod';

import { EhentaiClient } from '../_model/client';

const ParamSchema = z.object({
  gallery: z.string().regex(/^\d+-[a-z0-9]+$/i),
});

type Props = Readonly<{
  params: Promise<{
    gallery: string;
  }>;
}>;

export const GET = async (_req: Request, { params }: Props) => {
  const parsed = ParamSchema.safeParse(await params);

  if (!parsed.success) {
    return Response.json(parsed.error.format(), { status: 400 });
  }

  try {
    const [gid, token] = parsed.data.gallery.split('-');
    const client = new EhentaiClient();
    const result = await client.getGalleryDetail(gid, token);

    return Response.json(result);
  }
  catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
