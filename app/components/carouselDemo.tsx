"use client";
import * as React from "react";
import Image from "next/image";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Manga } from "../types/manga.interface";

interface CarouselSizeProps {
  comic: Manga[];
}

export function CarouselSize({ comic }: CarouselSizeProps) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="relative w-full max-w-5xl"
    >
      <CarouselContent>
        {comic.map((item) => (
          <CarouselItem key={item.id} className="basis-1/5 p-2">
            <div className="mt-2 text-center text-sm text-gray-50 hover:text-teal-400">
              {item.lang.toUpperCase()}
            </div>
            <div className="group relative overflow-hidden rounded-lg shadow-lg transition duration-300 ease-in-out hover:bg-slate-800">
              <Image
                src={item.cover}
                alt={item.title}
                layout="responsive"
                objectFit="cover"
                width={300}
                height={400}
                className="rounded-lg group-hover:brightness-75"
              />
              <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-sm p-2 truncate group-hover:bg-opacity-75">
                {item.title}
              </div>
            </div>
            
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hover:bg-slate-600 border-0"/>
      <CarouselNext className="hover:bg-slate-600 border-0"/>
    </Carousel>
  );
}
