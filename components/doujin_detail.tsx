import { BookText, Download, Eye, Heart, Languages, Pen, Star, Tag, User } from 'lucide-react';
import { Button } from './ui/button';
import { TagedDemo } from './taged_button';

import type { Doujin } from '@/app/api/nhentai/[doujin]/route';
import Link from 'next/link';

interface DoujinDemo {
  doujin: Doujin;
}

const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

export function DoujinDetail({ doujin }: DoujinDemo) {
  return (
    <div>
      <h1 className=" text-lg font-bold select-text">{doujin.title.japanese ? doujin.title.japanese : doujin.title.english}</h1>
      <button className="text-gray-400 mt-3 text-pretty font-bold hover:text-white" onClick={() => void copyText(doujin.id)}>
        #
        {doujin.id}
      </button>
      <TagedDemo tagged={doujin.parody} icon={<BookText />} type="系列" />
      <TagedDemo tagged={doujin.artists} icon={<Pen />} type="作者" />
      <TagedDemo tagged={doujin.characters} icon={<User />} type="出場角色" />
      <TagedDemo tagged={doujin.language} icon={<Languages />} type="語言" />
      <TagedDemo tagged={doujin.tags} icon={<Tag />} type="Tag" />
      <div className="flex gap-2 mt-2">
        <Heart />
        <span>{doujin.num_favorites}</span>
      </div>

      <div className="flex mt-7 gap-2 selection-none">
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
    </div>
  );
}
