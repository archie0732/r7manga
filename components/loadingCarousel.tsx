'use client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export function LoadingCarousel() {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="relative w-full max-w-6xl cursor-pointer select-none"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/5 py-1">
            <div className={`
              mx-auto mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-700
            `}
            >
            </div>
            <div className={`
              relative mt-4 h-64 animate-pulse rounded-lg bg-gray-800 shadow-lg
            `}
            >
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        disabled
        className={`
          cursor-not-allowed border-0 opacity-50
          hover:bg-gray-500
        `}
      />
      <CarouselNext
        disabled
        className={`
          cursor-not-allowed border-0 opacity-50
          hover:bg-gray-500
        `}
      />
    </Carousel>
  );
}
