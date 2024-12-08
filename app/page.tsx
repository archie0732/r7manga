"use client";
import { useEffect, useState } from "react";
import { CarouselSize } from "./components/carouselDemo";
import { Manga } from "./types/manga.interface";

export default function Home() {
  const [comicData, setComicData] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComicData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3001/api/nhentai/artist?artist=yan-yam");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = (await response.json()) as Manga[];
        setComicData(data);
      } catch (error) {
        console.error("Error fetching comic data:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComicData();
  }, []);

  if (error) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      <header className="text-white text-xl sm:text-3xl font-semibold mt-0 p-4">R7 Manga</header>

      <div className="flex justify-center items-center flex-grow mt-5">
        {isLoading ? <div className="text-white text-2xl">搜尋中...</div> : <CarouselSize comic={comicData} />}
      </div>
    </div>
  );
}
