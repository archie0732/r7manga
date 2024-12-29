import { useAppStore } from '@/stores/app';

interface TitleProps {
  text: string;
  protectTitle: string;
  url: string;
}

export function TitleDemo({ text, protectTitle, url }: TitleProps) {
  const protect = useAppStore().protect;
  return (
    <div className="flex select-none justify-center">
      <h1 className="flex items-center text-3xl">
        <img
          className="invert filter"
          src={url}
          alt="fire logomark"
          width={20}
          height={10}
        />
        {protect
          ? <span className="ml-2">{protectTitle}</span>
          : (
              <span className="ml-2">
                {text}
              </span>
            )}
      </h1>
    </div>
  );
}
