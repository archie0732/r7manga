import { DoujinSearchResult } from '@/app/api/nhentai/search/route';
import { SafeImage } from '../safe_image';
import Link from 'next/link';
import { useAppStore } from '@/stores/app';
import { Card } from '@/components/ui/card';

type Props = Readonly<{
  doujin: DoujinSearchResult;
}>;

export default function DoujinCard({ doujin }: Props) {
  const protect = useAppStore((state) => state.protect);

  return (
    <div className={`
      group relative scale-[0.98] transition
      hover:z-10 hover:scale-100
    `}
    >
      <Link
        key={doujin.id}
        href={`/n/${doujin.id}`}
        className="group-hover:absolute"
      >
        <Card
          className="flex flex-col gap-2 p-4"
        >
          <div className="text-center">
            {doujin.lang.toUpperCase()}
          </div>
          <SafeImage
            src={protect ? '/img/1210.png' : doujin.thumbnail}
            className="aspect-[5/7] flex-1 justify-center"
            alt="cover"
            width={250}
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
