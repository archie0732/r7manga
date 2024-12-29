'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/app';

import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Album } from '@/app/api/wnacg/[doujin]/route';
import { AlbumDetail } from '@/components/wnacg/album-detai';

type Props = Readonly<{
  params: Promise<{
    album: string;
  }>;
}>;

export default function Page({ params }: Props) {
  const [album, setAlbum] = useState<Album | null>(null);
  const protect = useAppStore().protect;

  useEffect(() => {
    void (async () => {
      const id = (await params).album;
      const response = await fetch(`/api/wnacg/${id}`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status.toString()}: ${await response.text()}`);
      }

      const data = await response.json() as Album;
      setAlbum(data);
    })();
  }, [params]);

  if (!album) {
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
            <img
              src={(protect || !album.cover) ? '/img/1210.png' : 'https:' + album.cover}
              width={300}
              height={300}
              alt="cover"
              className="rounded bg-gray-800"
            />
            <div>
              <AlbumDetail album={album} />
            </div>
          </div>
          <div>
            <h1 className="mt-10 text-xl">漫畫預覽:</h1>
            <div className="mt-4 flex flex-wrap justify-start gap-4">
              {album.view.slice(0, 14).map((url, i) => (
                <Link href={`/w/read/${album.id}`} key={i}>
                  <img
                    key={i}
                    src={protect ? '/img/1210.png' : 'https:' + url}
                    width={180}
                    height={200}
                    alt={`img-${i.toString()}`}
                    className="rounded-lg bg-gray-800"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
