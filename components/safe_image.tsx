import { twMerge } from 'tailwind-merge';

type Props = Readonly<React.ImgHTMLAttributes<HTMLImageElement>>;

export function SafeImage({ src = '/img/1210.png', alt = 'fail', className }: Props) {
  return (
    <div className={twMerge('flex flex-col', className)}>
      <img
        src={src}
        alt={alt}
        className="rounded object-conver"
      />
    </div>
  );
};
