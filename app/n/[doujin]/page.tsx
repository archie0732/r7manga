'use client';

import { Doujin } from '@/app/api/nhentai/[doujin]/route';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/app';
import { DoujinDetail } from '@/components/doujin_detail';
import { SafeImage } from '@/components/safe_image';

type Props = Readonly<{
  params: Promise<{
    doujin: string;
  }>;
}>;

export default function Page({ params }: Props) {
  const [doujin, setDoujin] = useState<Doujin | null>(null);
  const protect = useAppStore().protect;
  const imageURL = 'https://t3.nhentai.net/galleries/';

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
      <div>
      </div>
    );
  }

  return (
    <main>
      <div className="flex flex-col items-center mt-10">
        <div className="container flex flex-col gap-4">
          <div className="flex gap-4 flex-wrap">
            <SafeImage
              src={(protect || !doujin.cover) ? '/img/1210.png' : doujin.cover}
              width={250}
              height={250}
              alt="cover"
            />
            <div>
              <DoujinDetail doujin={doujin}></DoujinDetail>
            </div>
          </div>
          <div>
            <h1 className="text-white mt-10 text-xl">漫畫預覽:</h1>
            <div className="flex flex-wrap justify-start gap-4 mt-4">
              {doujin.images.slice(0, 12).map((url, i) => (
                <SafeImage
                  key={i}
                  src={protect ? '/img/1210.png' : imageURL + url.split('.')[0] + 't.' + url.split('.')[1]}
                  width={200}
                  height={200}
                  alt={`img-${i}`}
                  className="bg-gray-900 rounded-lg"
                />
              ))}

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
