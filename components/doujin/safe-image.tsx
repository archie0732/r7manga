import { useAppStore } from '@/stores/app';
import { twMerge } from 'tailwind-merge';

type Props = Readonly<React.ImgHTMLAttributes<HTMLImageElement>>;

export function SafeImage({ src = '/img/1210.png', alt = 'empty-image', className, width, height }: Props) {
  const { protect } = useAppStore();
  return (
    <div className={twMerge('flex flex-col', className)}>
      <img
        src={protect ? '/img/1210.png' : src}
        alt={alt}
        loading="lazy"
        width={width}
        height={height}
        className="rounded object-conver bg-gray-500"
      />
    </div>
  );
};
