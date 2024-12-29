import { Heading1 } from '@/components/ui/typography';
import { Flame } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function HomeLoading() {
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
          <div className={`
            grid grid-cols-2 gap-2 p-4
            md:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] md:gap-4
          `}
          >

            {[...Array(5).keys()].map((i) => (
              <Skeleton
                key={`${i}`}
                className={`
                  group relative flex aspect-[5/7] scale-[0.98] flex-col gap-2
                  p-4 transition
                  hover:z-10 hover:scale-100
                `}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
