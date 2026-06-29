'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/stores/app';
import { NextFavoriteButton } from '@/components/favorite/next-favorite-button';

import Image from 'next/image';

import type { HentaipawDoujin } from '@/app/api/hentaipaw/[doujin]/route';

type Props = Readonly<{
  params: Promise<{ doujin: string }>;
}>;

export default function Page({ params }: Props) {
  const [doujin, setDoujin] = useState<HentaipawDoujin | null>(null);
  const [value, setValue] = useState('');
  const { protect, protectImage, toggleProtect } = useAppStore();
  const router = useRouter();
  const selectRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    void (async () => {
      const id = (await params).doujin;
      const response = await fetch(`/api/hentaipaw/${id}`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status.toString()}: ${await response.text()}`);
      }

      setDoujin(await response.json() as HentaipawDoujin);
    })();
  }, [params]);

  const handleSetting = (nextValue: 'top' | 'overview' | 'home' | 'protect' | 'bottom') => {
    if (!doujin) return;

    const actions = {
      protect: () => { toggleProtect(!protect); },
      top: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); },
      home: () => { router.push('/'); },
      overview: () => { router.push(`/p/${doujin.id}`); },
      bottom: () => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); },
    };

    actions[nextValue]();
    setValue('');
  };

  if (!doujin) {
    return <div className="mt-10 flex justify-center text-gray-500"><span>Loading...</span></div>;
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <span>{doujin.title}</span>
      {doujin.pages.map((url, i) => (
        <Image
          key={`${doujin.id}-${i.toString()}`}
          src={protect ? protectImage : url}
          title={url}
          alt={`page-${i.toString()}`}
          width={900}
          height={1400}
          loading="lazy"
          className="bg-gray-800"
        />
      ))}
      <div className="mt-4 flex justify-center">
        <NextFavoriteButton currentId={doujin.id} website="hentaipaw" />
      </div>
      <div className="fixed bottom-4 right-4">
        <Select
          onValueChange={(nextValue) => {
            handleSetting(nextValue as 'top' | 'overview' | 'home' | 'protect' | 'bottom');
          }}
          value={value}
        >
          <SelectTrigger
            ref={selectRef}
            className="rounded-full border-2 px-4 py-2"
          >
            <SelectValue placeholder="Reader Menu" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="top">Back to top</SelectItem>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="protect">Toggle protect image</SelectItem>
              <SelectItem value="bottom">Jump to bottom</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
