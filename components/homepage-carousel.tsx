import { DoujinSearchResult } from '@/app/api/nhentai/search/route';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import DoujinCard from './card/doujin-card';

interface Props {
  doujin: DoujinSearchResult[];
}

export function HomePageCarousel({ doujin }: Props) {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full max-w-max"
    >
      <CarouselContent>
        {doujin.slice(0, 10).map((url, index) => (
          <CarouselItem
            key={index}
            className={`
              basis-1/2
              lg:basis-1/6
            `}
          >
            <div className="p-1">
              <DoujinCard doujin={url} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="overflow-hidden" />
      <CarouselNext className="overflow-x-hidden" />
    </Carousel>
  );
}
