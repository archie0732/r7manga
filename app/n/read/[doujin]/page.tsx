'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/stores/app';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { loadingPic, readDoujinURL } from '@/lib/const';

import Link from 'next/link';

import type { Doujin } from '@/app/api/nhentai/[doujin]/route';

import Image from 'next/image';

type Props = Readonly<{
  params: Promise<{ doujin: string }>;
}>;

export default function Page({ params }: Props) {
  const [doujin, setDoujin] = useState<string[]>();
  const [value, setValue] = useState<string>('無');
  const [id, setId] = useState<string>('');
  const protectMode = useAppStore();
  const router = useRouter();
  const selectRef = useRef<HTMLButtonElement>(null);

  const handleSetting = (value: 'top' | 'home' | 'overview' | 'protect' | 'bottom', id: string) => {
    const actions = {
      protect: () => { protectMode.toggleProtect(!protectMode.protect); },
      top: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); },
      home: () => { router.push('/'); },
      overview: () => { router.push(`/n/${id}`); },
      bottom: () => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); },
    };

    actions[value]();
    setValue('無');
  };

  useEffect(() => {
    const fetchDoujin = async () => {
      try {
        const doujinId = (await params).doujin;
        setId(doujinId);
        const response = await fetch(`/api/nhentai/${doujinId}`);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status.toString()}: ${await response.text()}`);
        }

        const data = (await response.json()) as Doujin;
        setDoujin(data.images);
      }
      catch (error) {
        console.error('Failed to fetch doujin:', error);
      }
    };

    void fetchDoujin();
  }, []);

  if (!doujin) {
    return <div className="mt-10 flex justify-center text-gray-500"><span>Loading...</span></div>;
  }

  return (
    <div className="mt-10 flex flex-col items-center">
      {doujin.map((url, i) => (
        (
          <Image
            src={readDoujinURL + url}
            alt={`img-alt-${i}`}
            key={'img-' + i}
            width={800}
            height={800}
            priority={true}
            blurDataURL="/img/20250108.jpg"
            placeholder="blur"
            title={readDoujinURL + url}
            onError={(e) => { e.currentTarget.src = loadingPic; }}
          />
        )
      ))}
      <div className="fixed bottom-4 right-4">
        <Select
          onValueChange={(value) => {
            handleSetting(value as 'top' | 'home' | 'overview' | 'protect' | 'bottom', id);
          }}
          value={value}
        >
          <SelectTrigger
            ref={selectRef}
            className="rounded-full border-2 px-4 py-2"
          >
            <SelectValue placeholder="選擇操作" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="top">回頂部</SelectItem>
              <SelectItem value="overview">回預覽</SelectItem>
              <SelectItem value="home">回首頁</SelectItem>
              <SelectItem value="protect">切換保護模式</SelectItem>
              <SelectItem value="bottom">切換至底部</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <span className="mt-5">漫畫結束了喔! 你可以:</span>
      <div className="flex gap-5">
        <Link href={`/n/${id}/related`}>
          <Button>瀏覽相關漫畫</Button>
        </Link>
        <Link href="https://youtu.be/dQw4w9WgXcQ?si=hS6FB_mz7pU6XiRA">
          <Button>支持我們</Button>
        </Link>
      </div>

    </div>
  );
}
