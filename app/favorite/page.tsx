import { auth } from '@/auth';
import { NhentaiDoujinFavorite } from '@/components/doujin/nhentai-doujin-favorites';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookHeart, UserPenIcon } from 'lucide-react';
import Link from 'next/link';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { fetchNhentai, langFromTagIds, listItemThumbnailUrl } from '../api/nhentai/_model/_lib/util';

import type { FavoriteData } from '../api/favorite/_model/apitype';
import type { APIGalleryListItem, APIPaginatedSearchResultData } from '../api/nhentai/_model/apitypes';
import type { DoujinSearchResult } from '../api/nhentai/search/route';

type Props = Readonly<{
  searchParams: Promise<{ p?: string }>;
}>;

const ADMIN_EMAIL = 'killer.archie.0732@gmail.com';
const PER_PAGE = 100;
const MAX_PAGES = 30;

const toSearchResult = async (doujin: APIGalleryListItem): Promise<DoujinSearchResult> => {
  const banTag: string[] = [];

  return {
    title: doujin.japanese_title ?? doujin.english_title,
    id: doujin.id.toString(),
    thumbnail: await listItemThumbnailUrl(doujin),
    banTag,
    lang: langFromTagIds(doujin.tag_ids),
    page: doujin.num_pages ?? 0,
  };
};

const fetchFavorites = async () => {
  const items: APIGalleryListItem[] = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const response = await fetchNhentai(`/favorites?page=${page}&per_page=${PER_PAGE}`);

    if (!response.ok) {
      throw new Error(`Failed to load favorites: ${response.status.toString()} ${await response.text()}`);
    }

    const data = await response.json() as APIPaginatedSearchResultData;
    items.push(...data.result);

    const numPages = Math.max(data.num_pages ?? 1, 1);
    if (page >= numPages) {
      break;
    }
  }

  return Promise.all(items.map(toSearchResult));
};

const fetchLocalFavorites = async () => {
  const filePath = resolve(process.cwd(), 'favorite.json');
  const raw = await readFile(filePath, 'utf8');
  const json = JSON.parse(raw) as FavoriteData;
  return json.favorite_nhentai?.doujin ?? [];
};

export default async function Page({ searchParams }: Props) {
  const session = await auth();

  if (session?.user?.email !== ADMIN_EMAIL) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-2 text-3xl font-bold">Favorites</h1>
        <div className="flex flex-col gap-2 text-gray-500">
          <span>Please sign in with admin account to view API favorites.</span>
          <Link
            href="/setting#cf-tk"
            className={`
              text-blue-500
              hover:underline
            `}
          >
            Open settings
          </Link>
        </div>
      </div>
    );
  }

  const { p } = await searchParams;

  let doujin: DoujinSearchResult[] = [];
  let source: 'nhentai' | 'local' = 'nhentai';
  let loadError: string | null = null;
  try {
    doujin = await fetchFavorites();
  }
  catch (error) {
    loadError = error instanceof Error ? error.message : 'Unknown error';

    try {
      doujin = await fetchLocalFavorites();
      source = 'local';
    }
    catch {
      return (
        <div className="flex justify-center">
          <span className="text-gray-500">Failed to load nhentai favorites. Please try again later.</span>
        </div>
      );
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-2 text-3xl font-bold">Favorites</h1>
      {source === 'local' && (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          nHentai favorites API unavailable. Showing local fallback list.
          {loadError && (
            <div className="mt-1 text-xs text-amber-700">
              {loadError}
            </div>
          )}
        </div>
      )}
      <Tabs defaultValue="nhentai-favorites" className="space-y-4">
        <TabsList>
          <TabsTrigger
            value="nhentai-favorites"
            className="flex items-center gap-2"
          >
            <BookHeart size={16} />
            Nhentai
          </TabsTrigger>
          <TabsTrigger value="wnacg" className="flex items-center gap-2">
            <UserPenIcon size={16} />
            Wnacg
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nhentai-favorites">
          <NhentaiDoujinFavorite doujin={doujin} curPage={Number(p ?? '1')} />
        </TabsContent>

        <TabsContent value="wnacg">
          {/** TO ADD wnacg */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
