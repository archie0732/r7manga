'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';

import { isAdminUser } from '@/lib/auth/admin';
import { useAppStore } from '@/stores/app';

import { AddFavoriteButton } from '../setting/add-favorite-doujin';
import { Button } from '../ui/button';
import { DoujinCarousel } from '../doujin-carousel';

import type { DoujinSearchResult } from '@/app/api/nhentai/search/route';

interface FavoriteProps {
  doujin: DoujinSearchResult[];
  curPage: number;
  totalPages: number;
}

export function NhentaiDoujinFavorite({ doujin, curPage, totalPages }: FavoriteProps) {
  const { offline } = useAppStore();
  const router = useRouter();
  const session = useSession();

  const currentEmail = session.data?.user?.email ?? '';
  const isAllowed = isAdminUser(session.data?.user);

  const page = curPage;
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const comic = doujin;

  const handlePageChange = (newPage: number) => {
    const clampedPage = Math.min(Math.max(newPage, 1), totalPages);
    router.push(`?p=${clampedPage}`);
  };

  const random = () => {
    if (doujin.length === 0) {
      return;
    }

    const id = doujin[Math.floor(Math.random() * doujin.length)].id;
    if (offline) {
      router.push(`/favorite/${id}`);
    }
    else {
      router.push(`/n/${id}`);
    }
  };

  if (session.status === 'loading') return (
    <div className="flex justify-center text-gray-500">
      Loading ...
    </div>
  );

  if (!isAllowed) {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-gray-500">只有管理員可以顯示</span>
        {currentEmail.length > 0 && (
          <span className="text-sm text-gray-500">
            Current account:
            {currentEmail}
          </span>
        )}
        <div>
          <Button variant="outline" onClick={() => void signIn()}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">nhentai favorites</h2>
        <div className="flex gap-1">
          <AddFavoriteButton />
          <Button onClick={random} variant="outline" disabled={doujin.length === 0}>random</Button>
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

      {comic.length > 0
        ? <DoujinCarousel comic={comic} website="n" mode={offline ? 'offline' : undefined} />
        : (
            <div className="py-8 text-center text-gray-500">
              No favorites found on this page.
            </div>
          )}

      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            rounded p-2
            hover:bg-gray-800
            disabled:opacity-50
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
            hover:bg-gray-800
            disabled:opacity-50
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
