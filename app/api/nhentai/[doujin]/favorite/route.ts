import { auth } from '@/auth';

import { fetchNhentai } from '../../_model/_lib/util';

type Params = Readonly<{
  params: Promise<{ doujin: string }>;
}>;

const ADMIN_EMAIL = 'killer.archie.0732@gmail.com';

const isAdmin = async () => {
  const session = await auth();
  return session?.user?.email === ADMIN_EMAIL;
};

export const GET = async (_req: Request, { params }: Params) => {
  if (!(await isAdmin())) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const id = (await params).doujin;
  const response = await fetchNhentai(`/galleries/${id}/favorite`);

  if (!response.ok) {
    return Response.json(
      { error: await response.text() },
      { status: response.status },
    );
  }

  const data = await response.json() as { favorited?: boolean; num_favorites?: number | null };

  return Response.json({
    favorited: data.favorited ?? false,
    num_favorites: data.num_favorites ?? null,
  });
};

export const POST = async (_req: Request, { params }: Params) => {
  if (!(await isAdmin())) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const id = (await params).doujin;
  const response = await fetchNhentai(`/galleries/${id}/favorite`, { method: 'POST' });

  if (!response.ok) {
    return Response.json(
      { error: await response.text() },
      { status: response.status },
    );
  }

  const data = await response.json() as { favorited?: boolean; num_favorites?: number | null };

  return Response.json({
    favorited: data.favorited ?? true,
    num_favorites: data.num_favorites ?? null,
  });
};

export const DELETE = async (_req: Request, { params }: Params) => {
  if (!(await isAdmin())) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const id = (await params).doujin;
  const response = await fetchNhentai(`/galleries/${id}/favorite`, { method: 'DELETE' });

  if (!response.ok) {
    return Response.json(
      { error: await response.text() },
      { status: response.status },
    );
  }

  const data = await response.json() as { favorited?: boolean; num_favorites?: number | null };

  return Response.json({
    favorited: data.favorited ?? false,
    num_favorites: data.num_favorites ?? null,
  });
};
