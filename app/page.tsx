'use client';

import { useEffect, useState } from 'react';

import { useDoujinStore } from '@/stores/doujin';
import { SelectSort } from '../components/selectSort';
import { TitleDemo } from '../components/mangaTitle';

import { DoujinCarousel } from '@/components/doujin_carousel';
import { HeaderDemo } from '@/components/head_carouse';

export default function Home() {
  const store = useDoujinStore();

  const [sort, setSort] = useState('recent');
  const [ids, setIds] = useState(new Set<string>());
  const doujin = Array.from(ids.values()).map((id) => store.doujin.get(id)!);

  const update = async () => {
    const data = await store.fetchHome(sort);
    setIds(new Set(data.map((v) => v.id)));
  };

  useEffect(() => {
    void update();
  }, [sort]);

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      <HeaderDemo />
      <div className="flex mb-10 justify-end mr-10">
        <SelectSort value={sort} onValueChange={setSort} />
      </div>
      <TitleDemo text="今日更新" url="/fire.svg" />
      <div className="flex justify-center">
        <DoujinCarousel comic={doujin} />
      </div>
    </div>
  );
}
