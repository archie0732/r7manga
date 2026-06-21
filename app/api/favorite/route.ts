import axios from 'axios';
import 'dotenv/config';
import { NextRequest } from 'next/server';

import type {
  FavoriteAdd,
  FavoriteCollectionMutation,
  FavoriteData,
  FavoriteRemove,
  FavoriteWebsite,
  GitHubFileResponse,
} from './_model/apitype';
import { addFavoriteEntry, ensureFavoriteShape, isDoujinFavorited, mutateFavoriteCollections, removeFavoriteEntry } from './_model/store';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'archie0732';
const REPO = 'r7-api-storage';
const FILE_PATH = 'data/favorite.json';
const BRANCH = 'main';

async function fetchRemoteFile(): Promise<{ content: FavoriteData; sha: string | null }> {
  try {
    const { data } = await axios.get<GitHubFileResponse>(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
      {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
      },
    );

    const decodedContent = JSON.parse(
      Buffer.from(data.content, 'base64').toString('utf-8'),
    ) as FavoriteData;

    return { content: ensureFavoriteShape(decodedContent), sha: data.sha };
  }
  catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { content: ensureFavoriteShape(null), sha: null };
    }
    throw error;
  }
}

async function updateGitHubFile(content: string, sha: string | null): Promise<void> {
  try {
    await axios.put(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
      {
        message: `${Date.now()} update favorite.json`,
        content: Buffer.from(content).toString('base64'),
        sha: sha ?? undefined,
        branch: BRANCH,
      },
      {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
      },
    );

    console.log('sucess sync to  GitHub。');
  }
  catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('GitHub API error:', error.response?.data ?? error.message);
    }
    else {
      console.error('unknow error:', error);
    }
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json() as FavoriteAdd | FavoriteCollectionMutation;

  const { content: remoteData, sha } = await fetchRemoteFile();
  let nextData: FavoriteData;

  try {
    nextData = typeof body.type === 'string' && body.type.startsWith('ehentai-collection-')
      ? mutateFavoriteCollections(remoteData, body as FavoriteCollectionMutation)
      : addFavoriteEntry(remoteData, body as FavoriteAdd);
  }
  catch {
    return new Response('Post data error', { status: 400 });
  }

  await updateGitHubFile(JSON.stringify(nextData, null, 2), sha);

  return new Response('Data synchronized with GitHub successfully.', { status: 200 });
}

export async function DELETE(req: NextRequest): Promise<Response> {
  const body = await req.json() as FavoriteRemove;

  if (body.type !== 'doujin' || !body.website || !body.id) {
    return new Response('Delete data error', { status: 400 });
  }

  const { content: remoteData, sha } = await fetchRemoteFile();
  const nextData = removeFavoriteEntry(remoteData, body);

  await updateGitHubFile(JSON.stringify(nextData, null, 2), sha);

  return new Response('Data synchronized with GitHub successfully.', { status: 200 });
}

export async function GET(req: NextRequest): Promise<Response> {
  const website = req.nextUrl.searchParams.get('website') as FavoriteWebsite | null;
  const id = req.nextUrl.searchParams.get('id');

  if (!website || website === 'nhentai' || !id) {
    return new Response('Query error', { status: 400 });
  }

  const { content: remoteData } = await fetchRemoteFile();
  const favorited = isDoujinFavorited(remoteData, website, id);

  return Response.json({ favorited });
}
