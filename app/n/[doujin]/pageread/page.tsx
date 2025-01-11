'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { APPSelection } from '@/components/app/app-select';

import type { Doujin } from '@/app/api/nhentai/[doujin]/route';
import Image from 'next/image';

type Props = Readonly<{
  params: Promise<{ doujin: string }>;
}>;

export default function Page({ params }: Props) {
  const [doujin, setDoujin] = useState<string[]>([]);
  const [id, setId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="relative w-full max-w-4xl">
        {doujin.length > 0 && (
          <Image
            src={`https://i1.nhentai.net/galleries${doujin[currentPage]}`}
            alt={`Page ${currentPage + 1}`}
            key={`img-${currentPage + 1}`}
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
        )}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 transform p-3">

        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 transform p-3">

        </div>
      </div>

      <div className={`
        mt-5 flex flex-col justify-center text-center text-gray-500
      `}
      >
        <span>
          頁數：
          {currentPage + 1}
          /
          {doujin.length}
        </span>
        {currentPage === doujin.length - 1 && (
          <div className="flex gap-5">
            <span>漫畫結束了喔! 你可以:</span>
            <Link href={`/n/${id}/related`}>
              <Button>瀏覽相關漫畫</Button>
            </Link>
            <Link href="https://youtu.be/dQw4w9WgXcQ?si=hS6FB_mz7pU6XiRA">
              <Button>支持我們</Button>
            </Link>
          </div>
        )}

      </div>

      <div className="fixed bottom-6 right-7">
        <APPSelection id={id} />
      </div>
    </div>
  );
}
