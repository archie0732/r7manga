import type { Doujin } from '@/app/api/nhentai/[doujin]/route';

interface DoujinDemo {
  doujin: Doujin;
}

export function DoujinDetail({ doujin }: DoujinDemo) {
  return (
    <div>
      <h1 className="text-white">{doujin.title.japanese ? doujin.title.japanese : doujin.title.english}</h1>
    </div>
  );
}
