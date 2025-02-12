import { FavoriteData } from '@/app/api/favorite/_model/apitype';
import { FavoriteImage } from '@/components/favorite/favorite-img';
import { LinkIcon } from 'lucide-react';
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

          <div className={`
            flex flex-col space-x-3
            md:flex-row
          `}
          >
            <FavoriteImage url={data.thumbnail} alt="cover" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{data.title}</span>

              <Link href={`https://nhentai.net/g/${data.id}/`} className="mt-5" target="_blank">
                <span className={`
                  flex items-center gap-1 text-gray-500
                  hover:underline hover:underline-offset-1
                `}
                >
                  <LinkIcon size={12} />
                  {data.id}
                </span>
              </Link>

              <div className="mt-5 border-4 p-2">
                <span>由於您使用了 cf_bypass 模式，所以無法查看本漫畫的詳細資訊。</span>
                <Link
                  href="/setting#cf-tk"
                  className={`
                    text-blue-500
                    hover:underline
                  `}
                >
                  前往設定
                </Link>
              </div>
            </div>

          </div>

        </div>
        <div className="mt-72">
          {
            Array.from({ length: data.page }).map((_, i) => (
              <FavoriteImage url={`/${mediaId}/${(i + 1)}.${extension}`} alt={`img-alt-${i + 1}`} key={i} />
            ))
          }
        </div>
      </div>
    </main>
  );
}
