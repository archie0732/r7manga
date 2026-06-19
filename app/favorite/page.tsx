import { auth } from '@/auth';
import { asAdminUser, isAdminUser } from '@/lib/auth/admin';
import { ensureFavoriteShape } from '@/app/api/favorite/_model/store';
import { FavoriteTabs } from '@/components/favorite/favorite-tabs';
import Link from 'next/link';

import { fetchNhentai, langFromTagIds, listItemThumbnailUrl } from '../api/nhentai/_model/_lib/util';

import type { FavoriteData, FavoriteDoujinItem } from '../api/favorite/_model/apitype';
import type { APIGalleryListItem, APIPaginatedSearchResultData } from '../api/nhentai/_model/apitypes';
import type { DoujinSearchResult } from '../api/nhentai/search/route';
import type { CarouselDoujinItem } from '@/components/doujin-carousel';

type Props = Readonly<{
  searchParams: Promise<{ p?: string }>;
}>;

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

const fetchStoredFavorites = async (): Promise<FavoriteData> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/yanami`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load stored favorites: ${response.status.toString()} ${await response.text()}`);
  }

  return ensureFavoriteShape(await response.json() as FavoriteData);
};

const toCarouselItems = (items: FavoriteDoujinItem[]): CarouselDoujinItem[] =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    thumbnail: item.thumbnail.startsWith('//') ? `https:${item.thumbnail}` : item.thumbnail,
    banTag: [],
    lang: item.lang === 'ja' || item.lang === 'zh' || item.lang === 'en' ? item.lang : 'zh',
    page: item.page,
  }));

export default async function Page({ searchParams }: Props) {
  const session = await auth();

  if (!isAdminUser(asAdminUser(session?.user))) {
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
  let storedFavorites = ensureFavoriteShape(null);
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

    storedFavorites = await fetchStoredFavorites();
  }
  catch (error) {
    loadError = error instanceof Error ? error.message : 'Unknown error';
  }

  const wnacgFavorites = toCarouselItems(storedFavorites.favorite_wnacg?.doujin ?? []);
  const hentaipawFavorites = toCarouselItems(storedFavorites.favorite_hentaipaw?.doujin ?? []);
  const ehentaiFavorites = toCarouselItems(storedFavorites.favorite_ehentai?.doujin ?? []);

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
      <FavoriteTabs
        nhentaiFavorites={doujin}
        nhentaiCurrentPage={currentPage}
        nhentaiTotalPages={totalPages}
        wnacgFavorites={wnacgFavorites}
        hentaipawFavorites={hentaipawFavorites}
        ehentaiFavorites={ehentaiFavorites}
      />
    </div>
  );
}
