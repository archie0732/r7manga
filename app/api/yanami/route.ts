import axios from 'axios';

import type { FavoriteData } from '../favorite/_model/apitype';

interface GitHubFileResponse {
  sha: string;
  content: string; // Base64-encoded content
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'archie0732';
const REPO = 'r7-api-storage';
const FILE_PATH = 'data/favorite.json';

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

export async function GET() {
  const { content } = await fetchRemoteFile();

  return Response.json(content);
}
