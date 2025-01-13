import { NextRequest } from 'next/server';
import axios from 'axios';
import 'dotenv/config';

export interface MyDoujinAPI {
  id: string;
  title: string;
  lang: string;
  cover: string;
}

export interface FavoriteData {
  name: string;
  id: string;
  favorite_nhentai: {
    doujin: MyDoujinAPI[];
    artist: string[];
    character: string[];
  };
}

export interface Favorite {
  type: 'character' | 'artist' | 'doujin';
  doujin?: MyDoujinAPI;
  artist?: string;
  character?: string;
}

interface GitHubFileResponse {
  sha: string;
  content: string; // Base64-encoded content
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'archie0732';
const REPO = 'r7manga-api';
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

    return { content: decodedContent, sha: data.sha };
  }
  catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { content: null as unknown as FavoriteData, sha: null };
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
      console.error('GitHub API error:', error.response?.data || error.message);
    }
    else {
      console.error('unknow error:', error);
    }
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json() as Favorite;

  const { content: remoteData, sha } = await fetchRemoteFile();

  if (body.type === 'doujin' && body.doujin) {
    remoteData.favorite_nhentai.doujin.push(body.doujin);
  }
  else if (body.type === 'artist' && body.artist) {
    remoteData.favorite_nhentai.artist.push(body.artist);
  }
  else if (body.type === 'character' && body.character) {
    remoteData.favorite_nhentai.character.push(body.character);
  }
  else {
    return new Response('Post data error', { status: 400 });
  }

  await updateGitHubFile(JSON.stringify(remoteData, null, 2), sha);

  return new Response('Data synchronized with GitHub successfully.', { status: 200 });
}
