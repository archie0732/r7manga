'use client';

import { useEffect, useState } from 'react';

import { useDoujinStore } from '@/stores/doujin';
import { SelectSort } from '../components/selectSort';

import { DoujinCarousel } from '@/components/doujin-carousel';
import { Heading1 } from '@/components/ui/typography';
import { Flame } from 'lucide-react';

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
    <div className="flex flex-col items-center">
      <main className="container flex flex-col">
        <div className="flex flex-col">
          <Heading1 className="relative flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <Flame size={48} />
              <span>今日更新</span>
            </div>
            <div className="md:absolute md:right-0">
              <SelectSort value={sort} onValueChange={setSort} />
            </div>
          </Heading1>
          <DoujinCarousel comic={doujin} />
        </div>
      </main>
    </div>
  );
}
