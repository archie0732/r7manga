import { Skeleton } from './ui/skeleton';

export function DoujinLodingCard() {
  return (
    <div className={`
      group relative scale-[0.98] transition
      hover:z-10 hover:scale-100
    `}
    >

      <Skeleton className="h-[300px] w-[200px]" />

    </div>
  );
}
