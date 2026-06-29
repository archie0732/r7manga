import 'dotenv/config';

import axios from 'axios';

import { EhentaiClient } from '../app/api/ehentai/_model/client';

type FavoriteDoujinItem = {
  id: string;
  title: string;
  thumbnail: string;
  lang: string;
  page: number;
  source?: string;
  artists?: string[];
  parodies?: string[];
};

type EhentaiCollection = {
  id: string;
  name: string;
  items: FavoriteDoujinItem[];
  createdAt: string;
  updatedAt: string;
};

type FavoriteData = {
  name?: string;
  id?: string;
  favorite_ehentai?: {
    doujin: FavoriteDoujinItem[];
    collections?: EhentaiCollection[];
  };
};

type GitHubFileResponse = {
  sha: string;
  content: string;
};

type CliOptions = {
  delayMs: number;
  limit: number | null;
  startAt: number;
  force: boolean;
  owner: string;
  repo: string;
  filePath: string;
  branch: string;
};

const DEFAULT_DELAY_MS = 2500;
const DEFAULT_OWNER = 'archie0732';
const DEFAULT_REPO = 'r7-api-storage';
const DEFAULT_FILE_PATH = 'data/favorite.json';
const DEFAULT_BRANCH = 'main';

const parseArgs = (argv: string[]): CliOptions => {
  const options: CliOptions = {
    delayMs: DEFAULT_DELAY_MS,
    limit: null,
    startAt: 0,
    force: false,
    owner: DEFAULT_OWNER,
    repo: DEFAULT_REPO,
    filePath: DEFAULT_FILE_PATH,
    branch: DEFAULT_BRANCH,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--delay' && argv[index + 1]) {
      options.delayMs = Number.parseInt(argv[index + 1]!, 10);
      index += 1;
      continue;
    }

    if (arg === '--limit' && argv[index + 1]) {
      options.limit = Number.parseInt(argv[index + 1]!, 10);
      index += 1;
      continue;
    }

    if (arg === '--start-at' && argv[index + 1]) {
      options.startAt = Number.parseInt(argv[index + 1]!, 10);
      index += 1;
      continue;
    }

    if (arg === '--owner' && argv[index + 1]) {
      options.owner = argv[index + 1]!;
      index += 1;
      continue;
    }

    if (arg === '--repo' && argv[index + 1]) {
      options.repo = argv[index + 1]!;
      index += 1;
      continue;
    }

    if (arg === '--path' && argv[index + 1]) {
      options.filePath = argv[index + 1]!;
      index += 1;
      continue;
    }

    if (arg === '--branch' && argv[index + 1]) {
      options.branch = argv[index + 1]!;
      index += 1;
      continue;
    }

    if (arg === '--force') {
      options.force = true;
    }
  }

  return options;
};

const sleep = (delayMs: number) => new Promise((resolveDelay) => setTimeout(resolveDelay, delayMs));

const isMetadataComplete = (item: FavoriteDoujinItem) =>
  Array.isArray(item.artists) && Array.isArray(item.parodies);

const parseMetadata = (tags: string[]) => {
  const artists = tags
    .filter((tag) => tag.startsWith('artist:'))
    .map((tag) => tag.slice('artist:'.length).trim())
    .filter(Boolean);
  const parodies = tags
    .filter((tag) => tag.startsWith('parody:'))
    .map((tag) => tag.slice('parody:'.length).trim())
    .filter(Boolean);

  return {
    artists: [...new Set(artists)],
    parodies: [...new Set(parodies)],
  };
};

const updateCollectionSnapshots = (
  collections: EhentaiCollection[] | undefined,
  targetId: string,
  artists: string[],
  parodies: string[],
) => {
  if (!collections) {
    return collections;
  }

  let touched = false;

  const nextCollections = collections.map((collection) => {
    let collectionTouched = false;
    const nextItems = collection.items.map((item) => {
      if (item.id !== targetId) {
        return item;
      }

      collectionTouched = true;
      return {
        ...item,
        artists,
        parodies,
      };
    });

    if (!collectionTouched) {
      return collection;
    }

    touched = true;
    return {
      ...collection,
      items: nextItems,
      updatedAt: new Date().toISOString(),
    };
  });

  return touched ? nextCollections : collections;
};

const buildContentsUrl = (options: CliOptions) =>
  `https://api.github.com/repos/${options.owner}/${options.repo}/contents/${options.filePath}`;

const buildGitHubHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
});

const fetchRemoteFile = async (options: CliOptions, token: string) => {
  const response = await axios.get<GitHubFileResponse>(buildContentsUrl(options), {
    headers: buildGitHubHeaders(token),
  });

  const content = JSON.parse(
    Buffer.from(response.data.content, 'base64').toString('utf8'),
  ) as FavoriteData;

  return {
    content,
    sha: response.data.sha,
  };
};

const updateRemoteFile = async (
  options: CliOptions,
  token: string,
  content: FavoriteData,
  sha: string,
) => {
  const response = await axios.put<{
    content?: {
      sha?: string;
    };
  }>(
    buildContentsUrl(options),
    {
      message: `${Date.now()} hydrate ehentai metadata`,
      content: Buffer.from(`${JSON.stringify(content, null, 2)}\n`, 'utf8').toString('base64'),
      sha,
      branch: options.branch,
    },
    {
      headers: buildGitHubHeaders(token),
    },
  );

  return response.data.content?.sha ?? sha;
};

const main = async () => {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error('Missing GITHUB_TOKEN in environment.');
  }

  const options = parseArgs(process.argv.slice(2));
  let { content: data, sha: initialSha } = await fetchRemoteFile(options, token);
  const favorites = data.favorite_ehentai?.doujin ?? [];

  if (favorites.length === 0) {
    console.log('No remote e-hentai favorites found.');
    return;
  }

  const candidates = favorites
    .map((item, index) => ({ item, index }))
    .filter(({ item, index }) => index >= options.startAt && (options.force || !isMetadataComplete(item)));

  const workItems = options.limit === null ? candidates : candidates.slice(0, options.limit);

  if (workItems.length === 0) {
    console.log('No remote favorites need hydration.');
    return;
  }

  const client = new EhentaiClient();
  let updatedCount = 0;
  let changed = false;

  console.log(`Hydrating ${workItems.length.toString()} remote e-hentai favorites from ${options.owner}/${options.repo}:${options.filePath}`);
  console.log(`Mode=single-thread delay=${options.delayMs.toString()}ms force=${options.force ? 'yes' : 'no'} branch=${options.branch} push=once-at-end`);

  for (let queueIndex = 0; queueIndex < workItems.length; queueIndex += 1) {
    const { item, index } = workItems[queueIndex]!;
    const [gid, tokenPart] = item.id.split('-', 2);

    if (!gid || !tokenPart) {
      console.warn(`[skip ${queueIndex + 1}/${workItems.length}] invalid id: ${item.id}`);
      continue;
    }

    console.log(`[${queueIndex + 1}/${workItems.length}] ${item.id} ${item.title}`);

    try {
      const detail = await client.getGalleryDetail(gid, tokenPart);
      const { artists, parodies } = parseMetadata(detail.tags);

      const targetFavorites = data.favorite_ehentai?.doujin ?? [];
      const targetIndex = targetFavorites.findIndex((favorite) => favorite.id === item.id);

      if (targetIndex === -1) {
        throw new Error(`Remote favorite not found during update: ${item.id}`);
      }

      targetFavorites[targetIndex] = {
        ...targetFavorites[targetIndex]!,
        artists,
        parodies,
      };

      if (data.favorite_ehentai) {
        data.favorite_ehentai.collections = updateCollectionSnapshots(
          data.favorite_ehentai.collections,
          item.id,
          artists,
          parodies,
        );
      }

      changed = true;
      updatedCount += 1;

      console.log(`  artists=${artists.length.toString()} parodies=${parodies.length.toString()} staged`);
    }
    catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  failed: ${message}`);
    }

    if (queueIndex < workItems.length - 1 && options.delayMs > 0) {
      await sleep(options.delayMs);
    }
  }

  if (!changed) {
    console.log('Done. No remote changes to push.');
    return;
  }

  try {
    const refreshed = await fetchRemoteFile(options, token);
    initialSha = refreshed.sha;
    const nextSha = await updateRemoteFile(options, token, data, initialSha);
    console.log(`Pushed remote update successfully. sha=${nextSha}`);
  }
  catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      console.error('Remote push failed with 409 conflict. Re-run the script after refreshing the remote file.');
    }
    else {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Remote push failed: ${message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Done. Updated ${updatedCount.toString()} remote item(s) and pushed once at the end.`);
};

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
