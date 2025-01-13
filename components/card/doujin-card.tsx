'use client';

import { DoujinSearchResult } from '@/app/api/nhentai/search/route';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useAppStore } from '@/stores/app';

type Props = Readonly<{
  doujin: DoujinSearchResult;
  website: string;
}>;

export default function DoujinCard({ doujin, website }: Props) {
  const { protect, protectImage } = useAppStore();
  return (
    <div
      className={`
        group relative transition-transform
        hover:z-10 hover:scale-105
      `}
    >
      <Link
        key={doujin.id}
        href={`/${website}/${doujin.id}`}
        className="relative"
      >
        <Card className="flex flex-col gap-2 p-4">
          <div className="text-center">{doujin.lang.toUpperCase()}</div>
          <Image
            loading="lazy"
            src={protect ? protectImage : doujin.thumbnail}
            className="aspect-[5/7] flex-1 justify-center object-cover"
            alt="cover"
            width={200}
            height={300}
          />
          <div className="truncate text-center">{doujin.title}</div>
        </Card>
      </Link>
    </div>
  );
}
