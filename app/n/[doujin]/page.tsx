'use client';

import { Doujin } from '@/app/api/nhentai/[doujin]/route';
import { useEffect, useState } from 'react';
import { DoujinDetail } from '@/components/doujin_detail';
import { viewDoujinURL } from '@/lib/const';
import { Skeleton } from '@/components/ui/skeleton';

import Link from 'next/link';
import { SafeImage } from '@/components/doujin/safe-image';
import { Button } from '@/components/ui/button';

type Props = Readonly<{
  params: Promise<{
    doujin: string;
  }>;
}>;

export default function Page({ params }: Props) {
  const [doujin, setDoujin] = useState<Doujin | null>(null);
  const [readMore, setReadMore] = useState<boolean>(false);

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
          <div className="flex flex-wrap gap-4">
            <SafeImage
              src={doujin.cover}
              width={300}
              height={300}
              alt="cover"
              className="rounded bg-gray-800"
            />
            <div>
              <DoujinDetail doujin={doujin} />
            </div>
          </div>
          <div>
            <h1 className="mt-10 text-xl">漫畫預覽:</h1>
            <div className={`
              mt-4 grid gap-1
              lg:grid-cols-5
              md:grid-cols-2
              sm:grid-cols-2
            `}
            >

              {doujin.images.slice(0, 10).map((url, i) => (
                <Link href={`/n/read/${doujin.id}`} key={i}>
                  <SafeImage
                    key={i}
                    src={viewDoujinURL + url.split('.')[0] + 't.' + url.split('.')[1]}
                    width={180}
                    height={200}
                    alt={`alt-${i.toString()}`}
                  />
                </Link>
              ))}
            </div>
            <div className={`
              mt-4 grid gap-1
              lg:grid-cols-5
              md:grid-cols-2
              sm:grid-cols-2
            `}
            >
              {
                readMore
                  ? doujin.images.slice(11, 21).map((url, i) => (
                      <Link href={`/n/read/${doujin.id}`} key={i}>
                        <SafeImage
                          key={`img-${i}`}
                          src={viewDoujinURL + url.split('.')[0] + 't.' + url.split('.')[1]}
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
                      <Button onClick={() => void setReadMore(true)} variant="outline">view More</Button>
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
