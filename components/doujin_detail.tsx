import type { Doujin } from '@/app/api/nhentai/[doujin]/route';

import { TagedDemo } from './taged_button';
import { Button } from './ui/button';
import Image from 'next/image';

interface DoujinDemo {
  doujin: Doujin;
}

const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

export function DoujinDetail({ doujin }: DoujinDemo) {
  return (
    <div>
      <h1 className="text-white text-lg">{doujin.title.japanese ? doujin.title.japanese : doujin.title.english}</h1>
      <button className="text-gray-400 mt-3 text-pretty font-bold hover:text-white" onClick={() => void copyText(doujin.id)}>
        #
        {doujin.id}
      </button>
      <TagedDemo tagged={doujin.parody} icon="/parody.svg" type="系列" />
      <TagedDemo tagged={doujin.artists} icon="/pencil.svg" type="作者" />
      <TagedDemo tagged={doujin.characters} icon="/users.svg" type="出場角色" />
      <TagedDemo tagged={doujin.language} icon="/language.svg" type="語言" />
      <TagedDemo tagged={doujin.tags} icon="/hashtag.svg" type="Tag" />
      <div className="flex mt-7">
        <Button className="bg-green-700 hover:bg-white hover:text-black group">
          <Image src="/eye.svg" width={20} height={20} alt="watch" className="invert group-hover:invert-0" />
          <p>Watch Now</p>
        </Button>
        <Button className=" group bg-slate-500 ml-2">
          <Image src="/download.svg" width={20} height={20} alt="downlaod" className="invert" />
        </Button>
        <Button className=" group bg-slate-500 hover:bg-amber-400 ml-2">
          <Image src="/star.svg" width={20} height={20} alt="downlaod" className="invert" />
        </Button>
      </div>
    </div>
  );
}
