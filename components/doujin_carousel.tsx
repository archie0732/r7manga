'use client';
import { useAppStore } from '@/stores/app';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import Image from 'next/image';

import * as React from 'react';
import { DoujinSearchResult } from '../app/api/nhentai/search/route';
import Link from 'next/link';

interface CarouselSizeProps {
  comic: DoujinSearchResult[];
}

export function DoujinCarousel({ comic }: CarouselSizeProps) {
  const protectMode = useAppStore().protect;
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="relative w-full max-w-6xl cursor-pointer select-none"
    >
      <CarouselContent>
        {comic.map((item) => (
          <CarouselItem key={item.id} className="basis-1/5 py-1">
            <div className="mt-2 text-center text-sm text-gray-50 hover:text-teal-400">
              {item.lang.toUpperCase()}
            </div>
            <Link href={`/n/${item.id}`}>

              <div className="group relative overflow-hidden rounded-lg shadow-lg transition duration-300 ease-in-out hover:bg-slate-800">
                <Image
                  src={protectMode == true ? '/img/1210.png' : item.thumbnail}
                  alt={item.title}
                  layout="responsive"
                  objectFit="cover"
                  width={300}
                  height={400}
                  className="rounded-lg group-hover:brightness-75 "
                />
                <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-sm p-2 truncate group-hover:bg-opacity-75">
                  {item.title}
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hover:bg-slate-600 border-0 cursor-pointer select-none" />
      <CarouselNext className="hover:bg-slate-600 border-0 cursor-pointer select-none" />
    </Carousel>
  );
}
