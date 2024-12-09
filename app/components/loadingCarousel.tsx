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
            <div className="mt-2 h-4 w-1/2 mx-auto bg-gray-700 rounded animate-pulse"></div>
            <div className="relative mt-4 h-64 bg-gray-800 rounded-lg shadow-lg animate-pulse"></div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        disabled
        className="hover:bg-gray-500 border-0 cursor-not-allowed opacity-50"
      />
      <CarouselNext
        disabled
        className="hover:bg-gray-500 border-0 cursor-not-allowed opacity-50"
      />
    </Carousel>
  );
}
