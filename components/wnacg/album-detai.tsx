'use client';

import { BookOpenText, Copy, Download, Eye, Star, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlbumTaged } from './album-tag';

import Link from 'next/link';
import Column from '../layout/column';
import { Heading3 } from '../ui/typography';
import { useToast } from '@/components/ui/hooks/use-toast';

import { Album } from '@/app/api/wnacg/[album]/route';

interface AlbumProp {
  album: Album;
}

const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

export function AlbumDetail({ album }: AlbumProp) {
  const { toast } = useToast();
  return (
    <Column className="items-start gap-2">
      <Heading3 className="select-text">{album.title}</Heading3>
      <button
        className="group flex items-center text-muted-foreground"
        onClick={() => {
          toast({
            title: '已複製文字內容',
            description: album.id,
          });
          void copyText(album.id);
        }}
      >
        <Copy
          className={`
            w-0 opacity-0 transition-[opacity_width]
            group-hover:w-4 group-hover:opacity-100
          `}
          size={12}
        />
        <span>{album.id}</span>
      </button>

      <AlbumTaged tag={album.tag} icon={<Tag />} label="標籤" />
      <div className="mt-2 flex gap-2">
        <BookOpenText />
        <span>{album.view.length}</span>

      </div>

      <div className="mt-7 flex gap-2 selection-none">
        <Link href={'/w/read/' + album.id}>
          <Button variant="aaa" className="font-bold">
            <Eye />
            <span>Read Now!</span>
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
