'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Doujin } from '@/app/api/nhentai/[doujin]/route';
import Image from 'next/image';
import { useAppStore } from '@/stores/app';
import { APPPageSelection } from '@/components/app/app-page-selector';

type Props = Readonly<{
  params: Promise<{ doujin: string }>;
}>;

export default function Page({ params }: Props) {
  const [doujin, setDoujin] = useState<string[]>([]);
  const [id, setId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set());
  const { nhentaiImageURL, protect, protectImage } = useAppStore();

  const fetchAPIData = async () => {
    try {
      const { doujin: doujinId } = await params;
      setId(doujinId);

      const response = await fetch(`/api/nhentai/${doujinId}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`,
        );
      }

      const data = (await response.json()) as Doujin;
      setDoujin(data.images);
    }
    catch (err) {
      console.error(err);
      setError('無法載入漫畫內容，請稍後再試。');
    }
    finally {
      setIsLoading(false);
    }
  };

  const preloadImage = (pageIndex: number) => {
    if (
      pageIndex >= 0
      && pageIndex < doujin.length
      && !preloadedImages.has(pageIndex)
      && !protect
    ) {
      const img: HTMLImageElement = document.createElement('img');
      img.src = `${nhentaiImageURL}${doujin[pageIndex]}`;
      setPreloadedImages((prev) => new Set([...prev, pageIndex]));
    }
  };

  useEffect(() => {
    if (doujin.length > 0 && !protect) {
      preloadImage(currentPage + 1);
      preloadImage(currentPage + 2);
    }
  }, [currentPage, doujin, protect]);

  useEffect(() => {
    void fetchAPIData();
  }, []);

  const handleNextPage = () => {
    if (currentPage < doujin.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNextPage();
      }
      else if (e.key === 'ArrowLeft') {
        handlePreviousPage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, doujin.length]);

  if (isLoading) {
    return (
      <div className="mt-10 flex justify-center text-gray-500">
        <span>載入中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 flex flex-col items-center text-gray-500">
        <span>{error}</span>
        <Link href="/">
          <Button className="mt-5">返回首頁</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-col items-center">
      <span className="mb-4 text-gray-600">
        頁數：
        {currentPage + 1}
        /
        {doujin.length}
      </span>
      <div className="relative w-full max-w-4xl">
        {doujin.length > 0 && (
          <>
            <Image
              src={protect ? protectImage : `${nhentaiImageURL}${doujin[currentPage]}`}
              alt={`Page ${currentPage + 1}`}
              key={`img-${currentPage}`}
              priority={true}
              title={`${nhentaiImageURL}${doujin[currentPage]}`}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
              className="cursor-pointer"
              width={0}
              height={0}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                if (clickX > rect.width / 2) {
                  handleNextPage();
                }
                else {
                  handlePreviousPage();
                }
              }}
            />

            {!protect && currentPage < doujin.length - 1 && (
              <Image
                src={`${nhentaiImageURL}${doujin[currentPage + 1]}`}
                alt={`Preload Page ${currentPage + 2}`}
                className="hidden"
                width={0}
                height={0}
                sizes="100vw"
              />
            )}
          </>
        )}
      </div>

      <div className={`
        mt-5 flex flex-col justify-center text-center text-gray-500
      `}
      >
        {currentPage === doujin.length - 1 && (
          <div className="gap-5">
            <span>漫畫結束了喔! 你可以:</span>
            <div className="flex gap-5">
              <Link href="https://youtu.be/dQw4w9WgXcQ?si=hS6FB_mz7pU6XiRA">
                <Button>支持我們</Button>
              </Link>
              <Link href={`/n/${id}/related`}>
                <Button>瀏覽相關漫畫</Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-7">
        <APPPageSelection id={id} />
      </div>
    </div>
  );
}
