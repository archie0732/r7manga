'use client';

import * as React from 'react';
import { DoujinSearchResult } from '../app/api/nhentai/search/route';
import DoujinCard from './card/doujin-card';

interface CarouselSizeProps {
  comic: DoujinSearchResult[];
}

export function DoujinCarousel({ comic }: CarouselSizeProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-2 md:gap-4 p-4">
      {comic.map((item) => (
        <DoujinCard key={item.id} doujin={item} />
      ))}
    </div>
  );
}
