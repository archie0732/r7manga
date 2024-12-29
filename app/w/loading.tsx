import { Book } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex items-center justify-center">
        <Book size={40} />
        <span className="text-5xl">Wnacg</span>
      </div>
      <div className={`
        grid grid-cols-2 gap-2 p-4
        md:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] md:gap-4
      `}
      >
        {[...Array(25).keys()].map((i) => (
          <Skeleton
            key={`${i}`}
            className={`
              group relative flex aspect-[5/7] scale-[0.98] flex-col gap-2 p-4
              transition
              hover:z-10 hover:scale-100
            `}
          />
        ))}
      </div>
    </div>
  );
}
