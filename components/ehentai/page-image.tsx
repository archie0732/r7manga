type Props = Readonly<{
  src: string;
  alt: string;
  title?: string;
}>;

export function EhentaiPageImage({ src, alt, title }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      title={title}
      loading="lazy"
      decoding="async"
      className="block h-auto w-full max-w-5xl"
    />
  );
}
