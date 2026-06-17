export const PLACEHOLDER_GIF = 'https://ehgt.org/g/blank.gif';

const isPlaceholderImage = (value: string) => value === PLACEHOLDER_GIF || value.startsWith('data:image/gif');

export const pickEhentaiThumb = (attrs: Record<string, string | undefined>) => {
  const candidates = [
    attrs['data-src'],
    attrs['data-lsrc'],
    attrs['data-lazy-src'],
    attrs.src,
  ];

  for (const candidate of candidates) {
    if (!candidate || isPlaceholderImage(candidate)) {
      continue;
    }

    return candidate;
  }

  return '';
};

export const extractStyleUrl = (style: string | undefined) => {
  if (!style) {
    return '';
  }

  const match = style.match(/url\((['"]?)(.*?)\1\)/i);
  return match?.[2] ?? '';
};
