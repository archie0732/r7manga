'use client';

import { useAppStore } from '@/stores/app';
import { useToast } from '../ui/hooks/use-toast';
import { FavoriteAdd, FavoriteData } from '@/app/api/favorite/_model/apitype';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';

interface HaveDoujin {
  id: string;
  title: string;
  thumbnail: string;
  lang: string;
}

{ /* TO DO: fix langauge  */ }

export function AddFavoriteButton({ id, title, thumbnail, lang }: HaveDoujin) {
  const { kindkey } = useAppStore();
  const { toast } = useToast();
  const [mydata, setMyData] = useState<number>(0); // 0 沒有收藏 1 有
  const [check, setCheck] = useState<boolean>(false);

  const addNew = async () => {
    toast({
      title: '正在嘗試加入收藏',
      description: '請勿連續點擊按鈕',
    });

    if (!check) {
      toast({
        title: '此功能尚未實作完畢',
        description: '此功能僅提供開發人員',
        variant: 'destructive',
      });
      return;
    }

    const resp = await fetch('/api/favorite', { method: 'POST', body: JSON.stringify({ type: 'doujin', doujin: { id, thumbnail, lang, title } } as FavoriteAdd) });

    if (!resp.ok) {
      toast({
        title: '發生錯誤',
        description: '嘗試更新 api時發生錯誤',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: '成功加入我的最愛',
      description: `已在您的收藏庫添加: ${title}`,
    });
    setMyData(1);
  };

  const fetchAPI = async () => {
    const res = await fetch('/api/yanami');
    if (!res.ok) {
      setMyData(0);
      return;
    }
    const doujin = await res.json() as FavoriteData;

    if (doujin.favorite_nhentai.doujin.some((a) => id == a.id)) {
      setMyData(1);
    }
  };

  useEffect(() => {
    const checkKey = async () => {
      const res = await fetch('/api/keyCheck', { method: 'POST', headers: {
        'Content-Type': 'application/json',
      }, body: JSON.stringify({ message: kindkey }) });

      setCheck(res.ok);
    };
    void fetchAPI();
    void checkKey();
  }, []);

  return (
    <div>

      {mydata === 1 && check
        ? (
            <Button
              size="icon"
              className={`
                bg-amber-500 text-white
                hover:bg-amber-700
              `}
              variant="secondary"
            >
              <Star />
            </Button>
          )
        : (
            <Button
              size="icon"
              variant="secondary"
              onClick={() => void addNew()}
            >
              <Star />
            </Button>
          )}
    </div>
  );
}
