'use client';

import { BookText, Copy, Download, Eye, Heart, Languages, Pen, Star, Tag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TagedDemo } from './taged_button';

import Link from 'next/link';
import Column from './layout/column';
import { Heading3 } from './ui/typography';
import { useToast } from '@/components/ui/hooks/use-toast';

import type { Doujin } from '@/app/api/nhentai/[doujin]/route';

interface DoujinDemo {
  doujin: Doujin;
}

const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

export function DoujinDetail({ doujin }: DoujinDemo) {
  const { toast } = useToast();
  return (
    <Column className="items-start gap-2">
      <Heading3 className="select-text">{doujin.title.japanese ? doujin.title.japanese : doujin.title.english}</Heading3>
      <button
        className="group flex items-center text-muted-foreground"
        onClick={() => {
          toast({
            title: '已複製文字內容',
            description: doujin.id,
          });
          void copyText(doujin.id);
        }}
      >
        <Copy
          className={`
            w-0 opacity-0 transition-[opacity_width]
            group-hover:w-4 group-hover:opacity-100
          `}
          size={12}
        />
        <span>{doujin.id}</span>
      </button>
      <TagedDemo tag={doujin.parody} icon={<BookText />} type="系列" />
      <TagedDemo tag={doujin.artists} icon={<Pen />} type="作者" />
      <TagedDemo tag={doujin.characters} icon={<User />} type="角色" />
      <TagedDemo tag={doujin.language} icon={<Languages />} type="語言" />
      <TagedDemo tag={doujin.tags} icon={<Tag />} type="標籤" />
      <div className="mt-2 flex gap-2">
        <Heart />
        <span>{doujin.num_favorites}</span>
      </div>

      <div className="mt-7 flex gap-2 selection-none">
        <Link href={'/n/read/' + doujin.id}>
          <Button variant="aaa" className="font-bold">
            <Eye />
            <span>Read Now</span>
          </Button>
        </Link>
        <Button size="icon" variant="secondary">
          <Download />
        </Button>
        <Button className="hover:bg-amber-400 hover:text-black" size="icon" variant="secondary">
          <Star />
        </Button>
      </div>
    </Column>
  );
}
