import { auth } from '@/auth';
import { NhentaiDoujinFavorite } from '@/components/doujin/nhentai-doujin-favorites';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookHeart, UserPenIcon } from 'lucide-react';
import Link from 'next/link';

import { fetchNhentai, langFromTagIds, listItemThumbnailUrl } from '../api/nhentai/_model/_lib/util';

import type { APIGalleryListItem, APIPaginatedSearchResultData } from '../api/nhentai/_model/apitypes';
import type { DoujinSearchResult } from '../api/nhentai/search/route';

type Props = Readonly<{
  searchParams: Promise<{ p?: string }>;
}>;

const ADMIN_EMAIL = 'killer.archie.0732@gmail.com';
const PER_PAGE = 20;

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

const fetchFavoritesPage = async (page: number) => {
  const response = await fetchNhentai(`/favorites?page=${page}&per_page=${PER_PAGE}`);

  if (!response.ok) {
    throw new Error(`Failed to load favorites: ${response.status.toString()} ${await response.text()}`);
  }

  const data = await response.json() as APIPaginatedSearchResultData;
  return {
    data: await Promise.all(data.result.map(toSearchResult)),
    totalPages: Math.max(data.num_pages ?? 1, 1),
  };
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
  const parsedPage = Number.parseInt(p ?? '1', 10);
  const requestedPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  let doujin: DoujinSearchResult[] = [];
  let totalPages = 1;
  let loadError: string | null = null;
  let currentPage = requestedPage;

  try {
    const favorites = await fetchFavoritesPage(requestedPage);
    doujin = favorites.data;
    totalPages = favorites.totalPages;

    if (requestedPage > totalPages) {
      currentPage = totalPages;
      const clampedFavorites = await fetchFavoritesPage(currentPage);
      doujin = clampedFavorites.data;
      totalPages = clampedFavorites.totalPages;
    }
  }
  catch (error) {
    loadError = error instanceof Error ? error.message : 'Unknown error';
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-2 text-3xl font-bold">Favorites</h1>
      {loadError && (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          Failed to load nHentai favorites from API.
          <div className="mt-1 text-xs text-amber-700">
            {loadError}
          </div>
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
          <NhentaiDoujinFavorite doujin={doujin} curPage={currentPage} totalPages={totalPages} />
        </TabsContent>

        <TabsContent value="wnacg">
          {/** TO ADD wnacg */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
