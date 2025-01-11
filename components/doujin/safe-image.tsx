import { useAppStore } from '@/stores/app';
import { twMerge } from 'tailwind-merge';

import { blankNice, errorPic } from '@/lib/const';
import Image from 'next/image';

type Props = Readonly<React.ImgHTMLAttributes<HTMLImageElement>>;

export function SafeImage({ src = errorPic, alt = 'empty-image', className, width, height }: Props) {
  const { protect } = useAppStore();
  return (
    <div className={twMerge('flex flex-col', className)}>
      <Image
        src={protect ? blankNice : src}
        alt={alt}
        width={typeof width === 'number' ? width : 200}
        height={typeof height === 'number' ? height : 200}
        className="rounded object-conver"
        title={src}
        placeholder="blur"
        blurDataURL={errorPic}
        loading="lazy"
        onError={(e) => { e.currentTarget.src = errorPic; }}
      />
    </div>
  );
};
