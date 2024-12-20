'use client';

import { useEffect, useState } from 'react';

import { useDoujinStore } from '@/stores/doujin';
import { SelectSort } from '@/components/selectSort';

import { DoujinCarousel } from '@/components/doujin-carousel';
import { Heading1 } from '@/components/ui/typography';
import { BookHeart } from 'lucide-react';

export default function Home() {
  const store = useDoujinStore();

  const [sort, setSort] = useState('recent');
  const [ids, setIds] = useState(new Set<string>());
  const [loing, setLoding] = useState(true);
  const doujin = Array.from(ids.values())
    .map((id) => store.doujin.get(id))
    .filter((v) => !!v);

  const update = async () => {
    setLoding(true);
    const data = await store.fetchHome(sort);
    setIds(new Set(data.map((v) => v.id)));
    setLoding(false);
  };

  useEffect(() => {
    void update();
  }, [sort]);

  return (
    <div className="flex flex-col items-center">
      <main className="container flex flex-col">
        <div className="flex flex-col">
          <Heading1 className={`
            relative flex flex-col items-center justify-center gap-8
            md:flex-row
          `}
          >
            <div className="flex items-center gap-2">
              <BookHeart size={48} />
              <span>nhentai</span>
            </div>

            <div className="md:absolute md:right-0">
              <SelectSort value={sort} onValueChange={setSort} />
            </div>
          </Heading1>
          { loing
            ? (
                <div className="flex items-center justify-center">
                  <span className="text-gray-400">
                    Loding....
                  </span>
                </div>
              )
            : <DoujinCarousel comic={doujin} />}
        </div>
      </main>
    </div>
  );
}
