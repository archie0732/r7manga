import { NextRequest } from 'next/server';
import { db } from '@/db';
import { favoriteDoujin } from '@/db/schema';
import { Doujin } from '../route';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import 'dotenv/config';

interface Params {
  params: Promise<{ doujin: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const id = (await params).doujin;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nhentai/${id}`);

  if (!res.ok) {
    return Response.json('fetch error', { status: 500 });
  }
  const doujin = await res.json() as Doujin;

  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json('you dont login yet', { status: 400 });
  }

  const userId = session?.user?.name ?? 'unknow';

  await db.insert(favoriteDoujin).values({
    userId,
    title: doujin.title.pretty,
    cover: doujin.cover,
    doujinId: doujin.id,
  });

  return Response.json('sucees!', { status: 200 });
}
