import { HentaipawClient } from '../_model/client';

type Params = Readonly<{
  params: Promise<{ doujin: string }>;
}>;

export type HentaipawDoujin = Awaited<ReturnType<HentaipawClient['getDoujinDetail']>>;

export async function GET(_req: Request, { params }: Params) {
  const id = (await params).doujin;

  try {
    const client = new HentaipawClient();
    const result = await client.getDoujinDetail(id);
    return Response.json(result);
  }
  catch (error) {
    console.error(error);
    return new Response('failure', { status: 500 });
  }
}
