import { twMerge } from 'tailwind-merge';

type Props = Readonly<React.HTMLAttributes<HTMLDivElement>>;

export default function Column({ className, ...props }: Props) {
  return <div {...props} className={twMerge('flex flex-col items-center', className)}></div>;
}
