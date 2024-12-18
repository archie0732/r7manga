import { twMerge } from 'tailwind-merge';

type Props = Readonly<React.HTMLAttributes<HTMLDivElement>>;

export default function Row({ className, ...props }: Props) {
  return <div {...props} className={twMerge('flex items-center', className)}></div>;
}
