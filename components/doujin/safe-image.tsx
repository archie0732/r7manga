import { useAppStore } from '@/stores/app';

import { blankNice, errorPic } from '@/lib/const';
import Image from 'next/image';

type Props = Readonly<React.ImgHTMLAttributes<HTMLImageElement>>;

export function SafeImage({ src = errorPic, alt = 'empty-image', width, height }: Props) {
  const { protect } = useAppStore();
  return (
    <div>
      <Image
        src={protect ? blankNice : src}
        alt={alt}
        width={typeof width === 'number' ? width : 200}
        height={typeof height === 'number' ? height : 200}
        title={src}
        placeholder="blur"
        blurDataURL={errorPic}
        loading="lazy"
      />
    </div>
  );
};
