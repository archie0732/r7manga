import { ensureFavoriteShape } from '@/app/api/favorite/_model/store';
import { CollectionsPageShell } from '@/components/ehentai/collections-page-shell';

import type { FavoriteData } from '@/app/api/favorite/_model/apitype';

const fetchStoredFavorites = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/yanami`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load stored favorites: ${response.status.toString()} ${await response.text()}`);
  }

  return ensureFavoriteShape(await response.json() as FavoriteData);
};

export default async function Page() {
  const data = await fetchStoredFavorites();

  return (
    <main className="container mx-auto space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Ehentai Collections</h1>
        <p className="text-sm text-muted-foreground">
          Filter saved favorites by artist or parody, preview them by cover, and manage collections without one long page.
        </p>
      </div>
      <CollectionsPageShell
        favorites={data.favorite_ehentai?.doujin ?? []}
        collections={data.favorite_ehentai?.collections ?? []}
      />
    </main>
  );
}
