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
      {doujin.map((url, index) => (
        <Image
          src={`https://i3.nhentai.net/galleries${url}`}
          title={`https://i3.nehntai.net/galleries${url}`}
          alt={`alt-${index + 1}`}
          key={`img-${index + 1}`}
          loading="lazy"
          width={800}
          height={800}
        />
      ))}

      <div
        className="mt-5 flex flex-col justify-center text-center text-gray-500"
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

      <div className="fixed bottom-6 right-7">
        <APPSelection id={id} />
      </div>
    </div>
  );
}
