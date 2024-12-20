import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { Skeleton } from './ui/skeleton';

export function HomePageLodingCarousel() {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full max-w-max"
    >
      <CarouselContent>
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem
            key={index}
            className={`
              basis-1/2
              lg:basis-1/6
            `}
          >
            <div className="p-0.5">
              <Skeleton className="h-[250px] w-[200px]" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="overflow-hidden" />
      <CarouselNext className="overflow-hidden" />
    </Carousel>
  );
}
