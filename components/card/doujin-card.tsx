import { DoujinSearchResult } from '@/app/api/nhentai/search/route';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { SafeImage } from '../doujin/safe-image';

type Props = Readonly<{
  doujin: DoujinSearchResult;
  website: string;
}>;

export default function DoujinCard({ doujin, website }: Props) {
  return (
    <div className={`
      group relative scale-[0.98] transition
      hover:z-10 hover:scale-100
    `}
    >
      <Link
        key={doujin.id}
        href={`/${website}/${doujin.id}`}
        className="group-hover:absolute"
      >
        <Card
          className="flex flex-col gap-2 p-4"
        >
          <div className="text-center">
            {doujin.lang.toUpperCase()}
          </div>
          <SafeImage
            src={doujin.thumbnail}
            className="aspect-[5/7] flex-1 justify-center object-cover"
            alt="cover"
            width={200}
            height={300}
          />
          <div className={`
            truncate text-center
            group-hover:text-wrap group-hover:[text-overflow:auto]
          `}
          >
            {doujin.title}
          </div>
        </Card>
      </Link>
    </div>
  );
}
