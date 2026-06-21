import { ensureFavoriteShape } from '@/app/api/favorite/_model/store';
import { CollectionEditor } from '@/components/ehentai/collection-editor';

import type { FavoriteData } from '@/app/api/favorite/_model/apitype';

type Props = Readonly<{
  params: Promise<{
    collection: string;
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

export default async function Page({ params }: Props) {
  const { collection } = await params;
  const data = await fetchStoredFavorites();
  const found = (data.favorite_ehentai?.collections ?? []).find((item) => item.id === collection);

  if (!found) {
    throw new Error('Collection not found');
  }

  return <CollectionEditor collection={found} />;
}
