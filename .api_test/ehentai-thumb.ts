export const PLACEHOLDER_GIF = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export const pickEhentaiThumb = (attrs: Record<string, string | undefined>) => {
  const src = attrs.src?.trim();
  const fallback = [attrs['data-src'], attrs['data-lsrc'], attrs['data-lazy-src']]
    .map((value) => value?.trim())
    .find((value) => value && value.length > 0);

  if (src && src.length > 0 && src !== PLACEHOLDER_GIF) {
    return src;
  }

  return fallback ?? src ?? '';
};
