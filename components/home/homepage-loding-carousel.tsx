import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

import { Skeleton } from '../ui/skeleton';

export function HomePageLodingCarousel() {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full max-w-max gap-0"
    >
      <CarouselContent className="gap-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <CarouselItem
            key={index}
            className={`
              m-0 basis-1/2 p-0
              lg:basis-1/6
            `}
          >
            <Skeleton className="m-0 h-[250px] w-[200px]" />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
