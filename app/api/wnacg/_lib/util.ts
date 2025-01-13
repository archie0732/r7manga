export const formatId = (id: string): string => {
  const paddedId = id.padStart(6, '0');

  const part1 = paddedId.slice(0, 4);
  const part2 = paddedId.slice(4, 6);

  return `${part1}/${part2}`;
};

export const getPicture = (id: string, page: number, extension: string, extension1: string) => {
  const readpage = [];

  readpage.push(`https://img5.qy0.ru/data/${id}/${(1).toString().padStart(page.toString().length, '0')}.${extension}`);
  for (let i = 1; i < page; i++) {
    const num = (i + 1).toString().padStart(page.toString().length, '0');
    readpage.push(`https://img5.qy0.ru/data/${id}/${num}.${extension1}`);
  }
  return readpage;
};

// https://img5.qy0.ru/data/2809/70/01.webp ok
// https://img5.qy0.ru/data/2809/70/1.webp
