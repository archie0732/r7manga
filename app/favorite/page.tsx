import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookHeart, UserPenIcon } from 'lucide-react';
import { FavoriteData } from '../api/favorite/_model/apitype';
import { NhentaiDoujinFavorite } from '@/components/doujin/nhentai-doujin-favorites';
import { SubScriptions } from '@/components/doujin/subscriptoin';

export default async function Page() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/yanami`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return <div>發生錯誤</div>;
  }

  const doujin = await res.json() as FavoriteData;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-2 text-3xl font-bold">Favorites & Subscriptions</h1>
      <Tabs defaultValue="nhentai-favorites" className="space-y-4">
        <TabsList>
          <TabsTrigger
            value="nhentai-favorites"
            className="flex items-center gap-2"
          >
            <BookHeart size={16} />
            Nhentai Favorites
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <UserPenIcon size={16} />
            SubScriptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nhentai-favorites">
          <NhentaiDoujinFavorite doujin={doujin.favorite_nhentai.doujin.slice().reverse()} />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubScriptions artist={doujin.favorite_nhentai.artist} />

        </TabsContent>
      </Tabs>
    </div>
  );
}
