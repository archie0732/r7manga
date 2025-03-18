import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookHeart, UserPenIcon } from 'lucide-react';
import { FavoriteData } from '../api/favorite/_model/apitype';
import { NhentaiDoujinFavorite } from '@/components/doujin/nhentai-doujin-favorites';
import Link from 'next/link';

type Props = Readonly<{
  searchParams: Promise<{ p?: string }>;
}>;

export default async function Page({ searchParams }: Props) {
  const { p } = await searchParams;
  void p;
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/yanami`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return (
      <div className="flex justify-center">
        <span className="text-gray-500">你啟用了cf_bypass 模式，此模式下只能查看以收藏漫畫，如需更改請</span>
        <Link
          href="/setting#cf-tk"
          className={`
            text-blue-500
            hover:underline
          `}
        >
          前往設定
        </Link>
      </div>
    );
  }

  const doujin = await res.json() as FavoriteData;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-2 text-3xl font-bold">Favorites</h1>
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
          <NhentaiDoujinFavorite doujin={doujin.favorite_nhentai.doujin.slice().reverse()} curPage={Number(p ?? '1')} />
        </TabsContent>

        <TabsContent value="wnacg">
          {/** TO ADD wnacg */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
