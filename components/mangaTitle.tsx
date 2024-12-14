import { useAppStore } from '@/stores/app';

import Image from 'next/image';

interface TitleProps {
  text: string;
  protectTitle: string;
  url: string;
}

export function TitleDemo({ text, protectTitle, url }: TitleProps) {
  const protect = useAppStore().protect;
  return (
    <div className="flex justify-center select-none">
      <h1 className="text-3xl flex items-center">
        <Image
          className="filter invert"
          src={url}
          alt="fire logomark"
          width={20}
          height={10}
        />
        {protect ? <span className="ml-2">{protectTitle}</span> : <span className="ml-2">{text}</span>}
      </h1>
    </div>
  );
}
