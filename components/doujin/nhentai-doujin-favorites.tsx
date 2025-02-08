'use client';
import { DoujinSearchResult } from '@/app/api/nhentai/search/route';
import { checkKey } from '@/lib/utils';
import { useAppStore } from '@/stores/app';
import { useEffect, useState } from 'react';
import { DoujinCarousel } from '../doujin-carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface FavoriteProps {
  doujin: DoujinSearchResult[];
}

export function NhentaiDoujinFavorite({ doujin }: FavoriteProps) {
  const { kindkey, offline } = useAppStore();
  const router = useRouter();
  const [check, setCheck] = useState<boolean>(false);
  const [curPage, setCurPage] = useState<number>(1);
  const [comic, setComic] = useState<DoujinSearchResult[]>([]);

  const PerPage = 20;
  const totalPages = Math.ceil(doujin.length / PerPage);

  useEffect(() => {
    const checkAccess = async () => {
      setCheck(await checkKey(kindkey));
    };
    void checkAccess();
  }, [kindkey]);

  useEffect(() => {
    const startIndex = (curPage - 1) * PerPage;
    const endIndex = startIndex + PerPage;
    setComic(doujin.slice(startIndex, endIndex));
  }, [curPage, doujin, PerPage]);

  if (doujin.length === 0) {
    return <div></div>;
  }

  if (check === false) {
    return <div>目前本功能暫時不開放</div>;
  }

  const setPage = (page: number) => {
    setCurPage(page);
  };

  const random = () => {
    const id = doujin[Math.floor(Math.random() * doujin.length)].id;
    router.push(`/n/${id}`);
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">nhentai favorites</h2>
        <Button onClick={random} variant="outline">random</Button>
      </div>
      <DoujinCarousel comic={comic} website="n" mode={offline ? 'offline' : undefined} />
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setPage(curPage - 1)}
          disabled={curPage === 1}
          className={`
            rounded p-2
            disabled:opacity-50 disabled:hover:bg-transparent
            hover:bg-gray-100
          `}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`
                rounded px-3 py-1
                ${curPage === index + 1
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-400'}
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage(curPage + 1)}
          disabled={curPage === totalPages}
          className={`
            rounded p-2
            disabled:opacity-50 disabled:hover:bg-transparent
            hover:bg-gray-400
          `}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        第
        {' '}
        {curPage}
        {' '}
        頁，共
        {' '}
        {totalPages}
        {' '}
        頁
      </div>
    </div>
  );
}
