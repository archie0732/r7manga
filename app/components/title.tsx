import { FireCustomIcon } from './icon/fire';

interface TitleProps {
  text: string;
}

export function TitleDemo({ text }: TitleProps) {
  return (
    <div className="flex justify-center select-none">
      <FireCustomIcon />
      <h1 className="text-white text-4xl">{text}</h1>
    </div>
  );
}
