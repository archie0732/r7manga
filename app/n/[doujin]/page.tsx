'use client';

import { Doujin } from '@/app/api/nhentai/[doujin]/route';
import { HeaderDemo } from '@/components/head_carouse';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/stores/app';
import { DoujinDetail } from '@/components/doujin_detail';

const SafeImage = ({ src = '/img/1210.png', width = 100, height = 100, alt = 'fail', className = '' }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError || !src) {
    return null;
  }

  return (
    <div className={`relative ${isLoading ? 'min-h-[100px]' : ''} ${className}`}>
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        onLoad={() => {
          setIsLoading(false);
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

type Props = Readonly<{
  params: Promise<{
    doujin: string;
  }>;
}>;

export default function Page({ params }: Props) {
  const [doujin, setDoujin] = useState<Doujin | null>(null);
  const protect = useAppStore().protect;
  const imageURL = 'https://i3.nhentai.net/galleries/';

  useEffect(() => {
    void (async () => {
      const id = (await params).doujin;
      const response = await fetch(`/api/nhentai/${id}`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}: ${await response.text()}`);
      }

      const data = await response.json() as Doujin;
      setDoujin(data);
    })();
  }, [params]);

  if (!doujin) {
    return (
      <div className="bg-black min-h-screen">
        <HeaderDemo />
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen">
      <HeaderDemo />
      <div className="flex flex-col items-center">
        <div className="container flex flex-col gap-4">
          <div className="flex gap-4">
            <SafeImage
              src={(protect || !doujin.cover) ? '/img/1210.png' : doujin.cover}
              width={200}
              height={200}
              alt="cover"
            />
            <div>
              <DoujinDetail doujin={doujin}></DoujinDetail>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-2">
              {doujin.images.map((url, i) => (
                <SafeImage
                  key={i}
                  src={(protect || !(imageURL + url)) ? '/img/1210.png' : imageURL + url}
                  width={100}
                  height={100}
                  alt="img"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
