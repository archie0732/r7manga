import { useAppStore } from '@/stores/app';
import { twMerge } from 'tailwind-merge';

import Image from 'next/image';
import { blankNice } from '@/lib/const';

type Props = Readonly<React.ImgHTMLAttributes<HTMLImageElement>>;

export function SafeImage({ src = '/img/1210.png', alt = 'empty-image', className, width, height }: Props) {
  const { protect } = useAppStore();
  return (
    <div className={twMerge('flex flex-col', className)}>
      <Image
        src={protect ? blankNice : src}
        alt={alt}
        width={typeof width === 'number' ? width : 200}
        height={typeof height === 'number' ? height : 200}
        className="rounded object-conver"
        priority={true}
        blurDataURL="/img/20250108.jpg"
        placeholder="blur"
        title={src}
      />
    </div>
  );
};
