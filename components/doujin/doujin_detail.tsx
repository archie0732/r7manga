'use client';

import { BookOpenText, BookText, Copy, Download, Heart, Languages, Pen, Tag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TagedDemo } from '../taged_button';

import Column from '../layout/column';
import { Heading3 } from '../ui/typography';
import { useToast } from '@/components/ui/hooks/use-toast';
import { ViewNowButtonA } from './viewnow-button';

import type { Doujin } from '@/app/api/nhentai/[doujin]/route';
import { LinkCarouselDemo } from '../nhentai/link-carousel';
import { AddFavoriteButton } from './add-favorite-button';
import { langFilter } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { SubArtistTagedDemo } from '../sub-artist-badge';
import { SubCharacterTagedDemo } from '../sub-character-badge';

interface DoujinDemo {
  doujin: Doujin;
  readMode: string;
}

const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

export function DoujinDetail({ doujin }: DoujinDemo) {
  const { toast } = useToast();
  const [lang, setLang] = useState<'zh' | 'ja' | 'en'>('ja');
  useEffect(() => {
    setLang(langFilter(doujin.language));
  }, [doujin]);
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
      <TagedDemo tag={doujin.parody} icon={<BookText />} label="系列" />
      <SubArtistTagedDemo tag={doujin.artists} icon={<Pen />} label="作者" />
      <SubCharacterTagedDemo tag={doujin.characters} icon={<User />} label="角色" />
      <TagedDemo tag={doujin.language} icon={<Languages />} label="語言" />
      <TagedDemo tag={doujin.tags} icon={<Tag />} label="標籤" />
      <div className="mt-2 flex gap-2">
        <BookOpenText />
        <span>{doujin.images.length}</span>
        <Heart />
        <span>{doujin.num_favorites}</span>
      </div>

      <div className="mt-7 flex gap-2 selection-none">
        <ViewNowButtonA id={doujin.id} />
        <Button size="icon" variant="secondary">
          <Download />
        </Button>
        <AddFavoriteButton id={doujin.id} title={doujin.title.japanese ?? doujin.title.pretty} thumbnail={doujin.thumbnail} lang={lang} page={doujin.images.length} />
        <LinkCarouselDemo id={doujin.id} title={doujin.title.pretty} />
      </div>
    </Column>
  );
}
