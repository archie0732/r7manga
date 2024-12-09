'use client';
import { useEffect, useState } from 'react';
import { CarouselSize } from './components/carouselDemo';
import { LoadingCarousel } from './components/loadingCarousel';

import { useWebMode } from '@/stores/webMode';
import { APIfetchError } from '@/lib/util/fetchAPI';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNHentaiArtistStore } from '@/stores/nhentai';

export default function Home() {
  const store = useNHentaiArtistStore();
  const { change, protect } = useWebMode();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleProtectMode = () => {
    change('protect');
  };

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
          <h2 className="text-white text-xl sm:text-3xl font-semibold">R7 Manga</h2>
          <p className="text-white sm:text-sm ">aaa</p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="protect-mode" defaultChecked={protect} onCheckedChange={handleProtectMode} className="data-[state=unchecked]:bg-slate-500 data-[state=checked]:bg-cyan-600 border-2" />
          <Label htmlFor="protect-mode" className="text-white">Protect Mode</Label>
        </div>
      </header>

      <div className="flex justify-center mt-5">
        {isLoading || !store.homeManga ? <LoadingCarousel /> : <CarouselSize comic={store.homeManga} />}
      </div>
    </div>
  );
}
