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
  website: string;
}

export function HomePageCarousel({ doujin, website }: Props) {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full max-w-max gap-0"
    >
      <CarouselContent>
        {doujin.slice(0, 10).map((url, index) => (
          <CarouselItem
            key={index}
            className={`
              mr-0 basis-1/2
              lg:basis-1/6
            `}
          >

            <DoujinCard doujin={url} website={website} />

          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className={`
        hidden basis-0
        lg:block
        md:block
      `}
      />
      <CarouselNext className={`
        hidden basis-0
        lg:block
        md:block
      `}
      />
    </Carousel>
  );
}
