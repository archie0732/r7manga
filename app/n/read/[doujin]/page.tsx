'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { APPSelection } from '@/components/app/app-select';

import { errorPic, readDoujinURL } from '@/lib/const';
import type { Doujin } from '@/app/api/nhentai/[doujin]/route';

type Props = Readonly<{
  params: Promise<{ doujin: string }>;
}>;

export default function Page({ params }: Props) {
  const [doujin, setDoujin] = useState<string[]>([]);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const [id, setId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerLoad = 3;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchDoujin = async () => {
      try {
        const doujinId = (await params).doujin;
        setId(doujinId);

        const response = await fetch(`/api/nhentai/${doujinId}`);
        if (!response.ok) {
          throw new Error(
            `Request failed with status ${response.status.toString()}: ${await response.text()}`,
          );
        }

        const data = (await response.json()) as Doujin;
        setDoujin(data.images);
        setVisibleItems(data.images.slice(0, itemsPerLoad));
        setCurrentIndex(itemsPerLoad);
      }
      catch (error) {
        console.error('Failed to fetch doujin:', error);
      }
    };

    void fetchDoujin();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || currentIndex >= doujin.length) return;

      const { scrollTop, scrollHeight } = document.documentElement;
      const windowHeight = window.innerHeight;

      if (scrollTop + windowHeight >= scrollHeight - 10) {
        setIsLoading(true);
        setTimeout(() => {
          const nextItems = doujin.slice(
            currentIndex,
            currentIndex + itemsPerLoad,
          );
          setVisibleItems((prev) => [...prev, ...nextItems]);
          setCurrentIndex((prev) => prev + itemsPerLoad);
          setIsLoading(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [doujin, isLoading, currentIndex]);

  if (!doujin.length) {
    return (
      <div className="mt-10 flex justify-center text-gray-500">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-col items-center">
      {visibleItems.map((url, index) => (
        <img
          src={`${readDoujinURL}${url}`}
          alt={`img-alt-${index}`}
          key={`img-${index}`}
          width={800}
          height={800}
          title={`${readDoujinURL}${url}`}
          onError={(e) => e.currentTarget.src = errorPic}
        />
      ))}

      {isLoading && (
        <div className="mt-5 text-gray-500">
          <span>Loading more...</span>
        </div>
      )}

      {currentIndex >= doujin.length && (
        <div className={`
          mt-5 flex flex-col justify-center text-center text-gray-500
        `}
        >
          <span>漫畫結束了喔! 你可以:</span>
          <div className="flex gap-5">
            <Link href={`/n/${id}/related`}>
              <Button>瀏覽相關漫畫</Button>
            </Link>
            <Link href="https://youtu.be/dQw4w9WgXcQ?si=hS6FB_mz7pU6XiRA">
              <Button>支持我們</Button>
            </Link>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-7">
        <APPSelection id={id} />
      </div>
    </div>
  );
}
