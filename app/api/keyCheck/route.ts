import { NextRequest } from 'next/server';

import 'dotenv/config';

interface CheckKEY {
  message: string;
}

export async function POST(req: NextRequest) {
  const key = await req.json() as CheckKEY;

  if (key.message === process.env.SAVE_KEY) {
    return Response.json('ok', { status: 200 });
  }

  return Response.json('you are gay', { status: 403 });
}
