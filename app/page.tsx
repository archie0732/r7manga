'use client';

import { useEffect, useState } from 'react';

import { useDoujinStore } from '@/stores/doujin';

import { Heading1 } from '@/components/ui/typography';
import { Flame } from 'lucide-react';
import { HomePageCarousel } from '@/components/homepage-carousel';
import { HomePageLodingCarousel } from '@/components/homepage-loding-carousel';

export default function Home() {
  const store = useDoujinStore();

  const [sort] = useState('recent');
  const [ids, setIds] = useState(new Set<string>());
  const [loading, setLoading] = useState(true);
  const doujin = Array.from(ids.values())
    .map((id) => store.doujin.get(id))
    .filter((v) => !!v);

  const update = async () => {
    setLoading(true);
    const data = await store.fetchHome(sort);
    setIds(new Set(data.map((v) => v.id)));
    setLoading(false);
  };

  useEffect(() => {
    void update();
  }, [sort]);

  return (
    <div className="flex flex-col items-center">
      <main className="container flex flex-col">
        <div className="flex flex-col">
          <Heading1
            className={`
              relative flex flex-col items-center justify-center gap-8
              md:flex-row
            `}
          >
            <div className="flex items-center gap-2">
              <Flame size={48} />
              <span>今日更新</span>
            </div>
            <div className="md:absolute md:right-0"></div>
          </Heading1>
          <div>
            {loading
              ? (
                  <HomePageLodingCarousel />
                )
              : (
                  <div className="m-3 flex p-4">
                    <HomePageCarousel doujin={doujin} />
                  </div>
                )}
          </div>
        </div>
      </main>
    </div>
  );
}
