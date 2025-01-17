'use client';

import { Doujin } from '@/app/api/nhentai/[doujin]/route';
import { useEffect, useState } from 'react';
import { DoujinDetail } from '@/components/doujin/doujin_detail';
import { viewDoujinURL } from '@/lib/const';
import { Skeleton } from '@/components/ui/skeleton';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/app';
import Image from 'next/image';

type Props = Readonly<{
  params: Promise<{
    doujin: string;
  }>;
}>;

export default function Page({ params }: Props) {
  const [doujin, setDoujin] = useState<Doujin | null>(null);
  const [readMore, setReadMore] = useState<boolean>(false);
  const { protect, protectImage, readMode } = useAppStore();

  useEffect(() => {
    void (async () => {
      const id = (await params).doujin;
      const response = await fetch(`/api/nhentai/${id}`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status.toString()}: ${await response.text()}`);
      }

      const data = await response.json() as Doujin;
      setDoujin(data);
    })();
  }, [params]);

  if (!doujin) {
    return (
      <div className="ml-20">
        <div className="flex">
          <Skeleton className="h-[400px] w-[300px]" />
          <div className="ml-5 gap-3">
            <Skeleton className="mt-2 h-[30px] w-[600px]" />
            <Skeleton className="mt-2 h-[30px] w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="ml-1.5 mt-10 flex flex-col items-center justify-center">
        <div className="container flex flex-col gap-4">

          {/* TO DO fix */}

          <div className="flex space-x-3">

            <Image
              src={protect ? protectImage : doujin.cover}
              width={300}
              height={300}
              alt="cover"
              className="rounded bg-gray-800"
            />
            <DoujinDetail doujin={doujin} readMode={readMode} />
          </div>

          <div>
            <h1 className="mt-10 text-xl">漫畫預覽:</h1>
            <div className={`
              mt-4 grid grid-cols-2 gap-4
              md:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] md:gap-4
            `}
            >

              {doujin.images.slice(0, 12).map((url, i) => (
                <Link href={`/n/read/${doujin.id}`} key={i}>
                  <Image
                    key={i}
                    src={protect ? protectImage : (viewDoujinURL + url.split('.')[0] + 't.' + url.split('.')[1])}
                    width={180}
                    height={200}
                    alt={`alt-${i.toString()}`}
                  />
                </Link>
              ))}
            </div>
            <div className={`
              mt-4 grid grid-cols-2 gap-4
              md:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] md:gap-4
            `}
            >
              {
                readMore
                  ? doujin.images.slice(13, 25).map((url, i) => (
                      <Link href={`/n/${doujin.id}/${readMode}`} key={i}>
                        <Image
                          key={`img-${i}`}
                          src={protect ? protectImage : (viewDoujinURL + url.split('.')[0] + 't.' + url.split('.')[1])}
                          width={180}
                          height={200}
                          alt={`alt-${i.toString()}`}
                        />
                      </Link>

                    ))
                  : <div />
              }
            </div>
            {
              readMore == false
                ? (
                    <div className="flex justify-end">
                      <Button onClick={() => void setReadMore(true)} variant="link">view More</Button>
                    </div>
                  )
                : <div />
            }

          </div>
        </div>
      </div>
    </main>
  );
}
