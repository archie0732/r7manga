import { ensureFavoriteShape } from '@/app/api/favorite/_model/store';
import { CollectionReader } from '@/components/ehentai/collection-reader';
import { buildFilteredReadQueue } from '@/components/ehentai/collection-reader-utils';

import type { FavoriteData } from '@/app/api/favorite/_model/apitype';

type Props = Readonly<{
  searchParams: Promise<{
    ids?: string;
  }>;
}>;

const fetchStoredFavorites = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/yanami`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load stored favorites: ${response.status.toString()} ${await response.text()}`);
  }

  return ensureFavoriteShape(await response.json() as FavoriteData);
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const ids = (params.ids ?? '').split(',').filter(Boolean);
  const data = await fetchStoredFavorites();
  const items = buildFilteredReadQueue(data.favorite_ehentai?.doujin ?? [], ids);

  return (
    <main className="container mx-auto p-4">
      <CollectionReader
        collection={{
          id: 'filtered',
          name: 'Filtered Read',
          items,
          createdAt: '',
          updatedAt: '',
        }}
      />
    </main>
  );
}
