import { Heading1 } from '@/components/ui/typography';
import { Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { NhnentaiHomePage } from '@/components/home/n-home-page';
import { WnacgHomePage } from '@/components/home/w-home-page';

export default function Home() {
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
            <div className="m-3 flex flex-col gap-5 p-4">
              <div className="flex justify-between">
                <span className="text-4xl font-bold">nhentai</span>
                <Link href="/n">
                  <Button variant="link">查看更多</Button>
                </Link>
              </div>
              <NhnentaiHomePage />

              <div className="flex justify-between">
                <span className="text-4xl font-bold">wnacg</span>
                <Link href="/w">
                  <Button variant="link">查看更多</Button>
                </Link>
              </div>
              <WnacgHomePage />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
