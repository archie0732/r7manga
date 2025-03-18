'use client';
import { DoujinSearchResult } from '@/app/api/nhentai/search/route';
import { checkKey } from '@/lib/utils';
import { useAppStore } from '@/stores/app';
import { useEffect, useState } from 'react';
import { DoujinCarousel } from '../doujin-carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { AddFavoriteButton } from '../setting/add-favorite-doujin';
import Link from 'next/link';

interface FavoriteProps {
  doujin: DoujinSearchResult[];
}

export function NhentaiDoujinFavorite({ doujin }: FavoriteProps) {
  const { kindkey, offline } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [check, setCheck] = useState<boolean>(false);
  const [comic, setComic] = useState<DoujinSearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  const PerPage = 20;
  const totalPages = Math.ceil(doujin.length / PerPage);

  const page = parseInt(searchParams?.get('page') ?? '1', 10);
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  useEffect(() => {
    const checkAccess = async () => {
      setLoading(true);
      setCheck(await checkKey(kindkey));
      setLoading(false);
    };
    void checkAccess();
  }, [kindkey]);

  useEffect(() => {
    setLoading(true);
    const startIndex = (currentPage - 1) * PerPage;
    const endIndex = startIndex + PerPage;
    setComic(doujin.slice(startIndex, endIndex));
    setLoading(false);
  }, [currentPage, doujin]);

  const handlePageChange = (newPage: number) => {
    const clampedPage = Math.min(Math.max(newPage, 1), totalPages);
    router.push(`?page=${clampedPage}`);
  };

  const random = () => {
    const id = doujin[Math.floor(Math.random() * doujin.length)].id;
    if (offline) {
      router.push(`/favorite/${id}`);
    }
    else {
      router.push(`/n/${id}`);
    }
  };

  if (doujin.length === 0) return <div></div>;
  if (loading) return <div className="flex justify-center text-gray-500">Loading ...</div>;
  if (!check) return <div>目前本功能暫時不開放</div>;

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">nhentai favorites</h2>
        <div className="flex gap-1">
          <AddFavoriteButton />
          <Button onClick={random} variant="outline">random</Button>
        </div>
      </div>

      <div>
        {offline
          ? (
              <div>
                <span className="text-gray-500">你啟用了cf_bypass 模式，此模式下只能查看以收藏漫畫如需更改請</span>
                <Link
                  href="/setting#cf-tk"
                  className={`
                    text-blue-500
                    hover:underline
                  `}
                >
                  前往設定
                </Link>
              </div>
            )
          : (
              <div>
                <span className="text-gray-500">目前由於cloudflare驗證無法使用n網閱讀器，如果是透過r7manga.vercel.app 使用的用戶請</span>
                <Link
                  href="/setting#cf-tk"
                  className={`
                    text-blue-500
                    hover:underline
                  `}
                >
                  開啟cf_bypass模式
                </Link>
              </div>
            )}
      </div>

      <DoujinCarousel comic={comic} website="n" mode={offline ? 'offline' : undefined} />

      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            rounded p-2
            disabled:opacity-50
            hover:bg-gray-800
          `}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex gap-2">
          {currentPage > 1 && (
            <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)}>
              {currentPage - 1}
            </Button>
          )}
          <Button className={`
            cursor-default bg-gray-400
            hover:bg-gray-400
          `}
          >
            {currentPage}
          </Button>
          {currentPage < totalPages && (
            <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)}>
              {currentPage + 1}
            </Button>
          )}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            rounded p-2
            disabled:opacity-50
            hover:bg-gray-800
          `}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        第
        {' '}
        {currentPage}
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
