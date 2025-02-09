import { FavoriteData } from '@/app/api/favorite/_model/apitype';
import { LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type Props = Readonly<{
  params: Promise<{
    doujin: string;
  }>;
}>;

export default async function Page({ params }: Props) {
  const id = (await params).doujin;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/yanami`);

  if (!res.ok) {
    throw new Error('offline mode fetch error');
  }

  const json = await res.json() as FavoriteData;

  const data = json.favorite_nhentai.doujin.find((doujin) => doujin.id == id);

  if (!data) {
    throw new Error('cannot find this doujin in this favorite list');
  }

  const mediaId = data.thumbnail.split('/')[4];
  const extension = data.thumbnail.split('.').pop();

  return (
    <main>
      <div className="ml-1.5 mt-10 flex flex-col items-center justify-center">
        <div className="container flex flex-col gap-4">

          <div className="flex space-x-3">

            <Image
              src={data.thumbnail}
              width={300}
              height={300}
              alt="cover"
              className="rounded bg-gray-800"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{data.title}</span>

              <Link href={`https://nhentai.net/g/${data.id}/`} className="mt-5">
                <span className={`
                  flex items-center gap-1 text-gray-500
                  hover:underline hover:underline-offset-1
                `}
                >
                  <LinkIcon size={12} />
                  {data.id}
                </span>
              </Link>
            </div>

          </div>

        </div>
        <div className="mt-72">
          {
            Array.from({ length: data.page }).map((_, i) => (
              <Image src={`https://i2.nhentai.net/galleries/${mediaId}/${(i + 1)}.${extension}`} alt={`img-${i}`} height={800} width={800} key={`img-${i}`} />
            ))
          }
        </div>
      </div>
    </main>
  );
}
