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
    <div className="relative group hover:z-10 scale-[0.98] hover:scale-100 transition">
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
            className="flex-1 justify-center aspect-[5/7]"
            alt="cover"
            width={250}
            height={300}
          />
          <div className="truncate group-hover:[text-overflow:auto] group-hover:text-wrap text-center">
            {doujin.title}
          </div>
        </Card>
      </Link>
    </div>
  );
}
