import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col justify-center">
      <div className="mr-5 flex justify-between">
        <div>
          <Button className="ml-5" variant="ghost" disabled>
            最近
          </Button>
          <Button className="ml-5" variant="ghost" disabled>
            本日
          </Button>
          <Button className="ml-5" variant="ghost" disabled>
            這周
          </Button>
          <Button className="ml-5" variant="ghost" disabled>
            所有時間
          </Button>
        </div>
      </div>
      <div className={`
        grid grid-cols-2 gap-2 p-4
        md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:gap-4
      `}
      >
        {[...Array(25).keys()].map((i) => (
          <Skeleton
            key={`${i}`}
            className={`
              group relative flex aspect-5/7 scale-[0.98] flex-col gap-2 p-4
              transition
              hover:z-10 hover:scale-100
            `}
          />
        ))}
      </div>
    </div>
  );
}
