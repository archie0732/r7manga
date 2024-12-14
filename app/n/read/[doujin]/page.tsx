'use client';

import React, { useEffect, useState, useRef } from 'react';
import { SafeImage } from '@/components/safe_image';
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

import type { Doujin } from '@/app/api/nhentai/[doujin]/route';

type Props = Readonly<{
  params: Promise< { doujin: string }>;
}>;

export default function Page({ params }: Props) {
  const [doujin, setDoujin] = useState<string[] | null>(null);
  const [value, setValue] = useState<string>('無');
  const [id, setId] = useState<string>('543435');
  const protectMode = useAppStore();
  const router = useRouter();
  const selectRef = useRef<HTMLButtonElement>(null);

  const imageURL = 'https://i3.nhentai.net/galleries/';

  const handleSetting = (value: 'top' | 'home' | 'overview' | 'protect' | 'bottom') => {
    switch (value) {
      case 'protect':
        protectMode.toggleProtect(!protectMode.protect);
        break;
      case 'top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'home':
        router.push('/');
        break;
      case 'overview':
        router.push(`/n/${id}`);
        break;
      case 'bottom':
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
        break;
      default:
        break;
    }
    resetValue();
  };

  const resetValue = () => {
    setValue('無');
  };

  useEffect(() => {
    const fetchDoujin = async () => {
      const doujinId = (await params).doujin;
      setId(doujinId);
      const response = await fetch(`/api/nhentai/${id}`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}: ${await response.text()}`);
      }

      const data = (await response.json()) as Doujin;
      setDoujin(data.images);
    };

    void fetchDoujin();
  }, [id]);

  return (
    <div className="flex flex-col items-center mt-10">
      {doujin?.map((url, i) => (
        <SafeImage
          src={protectMode.protect ? '/img/1210.png' : imageURL + url}
          width={600}
          height={800}
          key={i}
          className="bg-gray-900 rounded-lg"
        />
      ))}
      <div className="fixed bottom-4 right-4">
        <Select
          onValueChange={(value) => {
            handleSetting(value as 'top' | 'home' | 'overview' | 'protect' | 'bottom');
          }}
          value={value}
        >
          <SelectTrigger ref={selectRef} className="rounded-full border-2 px-4 py-2 ">
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
    </div>
  );
}
