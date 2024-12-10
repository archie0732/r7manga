'use client';
import { useEffect, useState } from 'react';
import { CarouselSize } from '../components/carouselDemo';
import { LoadingCarousel } from '../components/loadingCarousel';

import { useAppStore } from '@/stores/app';
import { APIfetchError } from '@/lib/util/fetchAPI';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNHentaiHomeStore } from '@/stores/nhentai';
import { SelectSort } from '../components/selectSort';
import { TitleDemo } from '../components/mangaTitle';

import Image from 'next/image';

export default function Home() {
  const store = useNHentaiHomeStore();
  const appStore = useAppStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      void store.fetchHome();
    }
    catch (error) {
      setError(error instanceof APIfetchError ? error.message : 'unknow error');
    }
    finally {
      setIsLoading(false);
    }
  }, []);

  if (error) {
    return { message: 'fetch web error' };
  }

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      <header className="mt-0 p-4 flex justify-between select-none">
        <div className="flex">
          <Image className="filter invert mr-3" src="/book.svg" alt="book logo" width={30} height={40} />
          <h1 className="text-white text-xl sm:text-3xl font-semibold flex-row">
            R7 Manga
          </h1>
          <p className="text-white sm:text-sm ">aaa</p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="protect-mode"
            defaultChecked={appStore.protect}
            onCheckedChange={() => appStore.toggleProtect()}
            className="data-[state=unchecked]:bg-slate-500 data-[state=checked]:bg-cyan-600 border-2"
          />
          <Label htmlFor="protect-mode" className="text-white">Protect Mode</Label>
        </div>
      </header>
      <div className="flex mb-10 justify-end mr-10">
        <SelectSort />
      </div>
      <TitleDemo text="今日更新" url="/fire.svg" />
      <div className="flex justify-center">
        {isLoading || !store.doujin ? <LoadingCarousel /> : <CarouselSize comic={Array.from(store.doujin.values())} />}
      </div>
    </div>
  );
}
