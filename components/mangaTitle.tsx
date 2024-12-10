import Image from 'next/image';

interface TitleProps {
  text: string;
  url: string;
}

export function TitleDemo({ text, url }: TitleProps) {
  return (
    <div className="flex justify-center select-none">
      <h1 className="text-white text-3xl flex items-center">
        <Image
          className="filter invert"
          src={url}
          alt="fire logomark"
          width={20}
          height={10}
        />
        <span className="ml-2">{text}</span>
      </h1>
    </div>
  );
}
