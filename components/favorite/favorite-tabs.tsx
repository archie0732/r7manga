'use client';

import { useEffect, useState } from 'react';
import { BookHeart, Globe, PawPrint, UserPenIcon } from 'lucide-react';

import { DoujinCarousel } from '@/components/doujin-carousel';
import { EhentaiFavoritesPanel } from '@/components/favorite/ehentai-favorites-panel';
import { NhentaiDoujinFavorite } from '@/components/doujin/nhentai-doujin-favorites';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { CarouselDoujinItem } from '@/components/doujin-carousel';
import type { FavoriteDoujinItem } from '@/app/api/favorite/_model/apitype';
import type { DoujinSearchResult } from '@/app/api/nhentai/search/route';

type FavoriteTabValue = 'nhentai-favorites' | 'wnacg' | 'hentaipaw' | 'ehentai';

type Props = Readonly<{
  nhentaiFavorites: DoujinSearchResult[];
  nhentaiCurrentPage: number;
  nhentaiTotalPages: number;
  wnacgFavorites: CarouselDoujinItem[];
  hentaipawFavorites: CarouselDoujinItem[];
  ehentaiFavorites: CarouselDoujinItem[];
  ehentaiFavoriteItems: FavoriteDoujinItem[];
}>;

const DEFAULT_TAB: FavoriteTabValue = 'nhentai-favorites';

const isFavoriteTabValue = (value: string): value is FavoriteTabValue =>
  value === 'nhentai-favorites' || value === 'wnacg' || value === 'hentaipaw' || value === 'ehentai';

const getTabFromHash = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_TAB;
  }

  const hash = window.location.hash.replace(/^#/, '');
  return isFavoriteTabValue(hash) ? hash : DEFAULT_TAB;
};

export function FavoriteTabs({
  nhentaiFavorites,
  nhentaiCurrentPage,
  nhentaiTotalPages,
  wnacgFavorites,
  hentaipawFavorites,
  ehentaiFavorites,
  ehentaiFavoriteItems,
}: Props) {
  const [tab, setTab] = useState<FavoriteTabValue>(DEFAULT_TAB);

  useEffect(() => {
    const syncFromHash = () => {
      setTab(getTabFromHash());
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);

    return () => {
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, []);

  const changeTab = (value: string) => {
    if (!isFavoriteTabValue(value)) {
      return;
    }

    setTab(value);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${value}`);
  };

  return (
    <Tabs value={tab} onValueChange={changeTab} className="space-y-4">
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
        <TabsTrigger value="hentaipaw" className="flex items-center gap-2">
          <PawPrint size={16} />
          Hentaipaw
        </TabsTrigger>
        <TabsTrigger value="ehentai" className="flex items-center gap-2">
          <Globe size={16} />
          Ehentai
        </TabsTrigger>
      </TabsList>

      <TabsContent value="nhentai-favorites">
        <NhentaiDoujinFavorite
          doujin={nhentaiFavorites}
          curPage={nhentaiCurrentPage}
          totalPages={nhentaiTotalPages}
        />
      </TabsContent>

      <TabsContent value="wnacg">
        {wnacgFavorites.length > 0
          ? <DoujinCarousel comic={wnacgFavorites} website="w" />
          : (
              <div className="py-8 text-center text-gray-500">
                No wnacg favorites found.
              </div>
            )}
      </TabsContent>

      <TabsContent value="hentaipaw">
        {hentaipawFavorites.length > 0
          ? <DoujinCarousel comic={hentaipawFavorites} website="p" />
          : (
              <div className="py-8 text-center text-gray-500">
                No hentaipaw favorites found.
              </div>
            )}
      </TabsContent>

      <TabsContent value="ehentai">
        {ehentaiFavoriteItems.length > 0
          ? <EhentaiFavoritesPanel favorites={ehentaiFavoriteItems} />
          : (
              <div className="py-8 text-center text-gray-500">
                No ehentai favorites found.
              </div>
            )}
      </TabsContent>
    </Tabs>
  );
}
