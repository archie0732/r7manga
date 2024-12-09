'use client';
import { useEffect, useState } from 'react';
import { CarouselSize } from './components/carouselDemo';
import { useNHentaiArtistStore } from '@/stores/nhentai';
import { APIfetchError } from '@/lib/util/fetchAPI';

export default function Home() {
  const store = useNHentaiArtistStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      void store.fetch('yan-yam');
    }
    catch (error) {
      setError(error instanceof APIfetchError ? error.message : 'unknow error');
    }
    finally {
      setIsLoading(true);
    }
  }, []);

  if (error) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">
          Error:
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      <header className="text-white text-xl sm:text-3xl font-semibold mt-0 p-4">R7 Manga</header>

      <div className="flex justify-center items-center flex-grow mt-5">
        {isLoading ? <div className="text-white text-2xl">搜尋中...</div> : <CarouselSize comic={store.manga} />}
      </div>
    </div>
  );
}
