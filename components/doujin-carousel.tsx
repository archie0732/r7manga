'use client';

import * as React from 'react';
import { DoujinSearchResult } from '../app/api/nhentai/search/route';
import DoujinCard from './card/doujin-card';

interface CarouselSizeProps {
  comic: DoujinSearchResult[] ;
  website: string;
  mode?: 'offline';
}

export function DoujinCarousel({ comic, website, mode }: CarouselSizeProps) {
  return (
    <div className={`
      grid grid-cols-2 gap-2 p-4
      md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:gap-4
    `}
    >
      {comic.map((item) => (
        <DoujinCard key={item.id} doujin={item} website={website} mode={mode} />
      ))}
    </div>
  );
}
