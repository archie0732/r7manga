import { twMerge } from 'tailwind-merge';

type Props = Readonly<React.ImgHTMLAttributes<HTMLImageElement>>;

export function SafeImage({ src = '/img/1210.png', alt = 'fail', className, width, height }: Props) {
  return (
    <div className={twMerge('flex flex-col', className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded object-conver"
      />
    </div>
  );
};
