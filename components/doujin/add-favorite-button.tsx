'use client';

import { useAppStore } from '@/stores/app';
import { useToast } from '../ui/hooks/use-toast';
import { Favorite, FavoriteData } from '@/app/api/favorite/route';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';

interface HaveDoujin {
  id: string;
  title: string;
  cover: string;
  lang: string;
}

{ /* TO DO: fix langauge  */ }

export function AddFavoriteButton({ id, title, cover, lang }: HaveDoujin) {
  const { kindkey } = useAppStore();
  const { toast } = useToast();
  const [mydata, setMyData] = useState<number>(0); // 0 沒有收藏 1 有

  const addNew = async () => {
    const res = await fetch('/api/keyCheck', { method: 'POST', headers: {
      'Content-Type': 'application/json',
    }, body: JSON.stringify({ message: kindkey }) });
    if (!res.ok) {
      toast({
        title: '目前此功能尚未實作完畢',
        description: 'sorry',
        variant: 'destructive',
      });
      return;
    }

    const resp = await fetch('/api/favorite', { method: 'POST', body: JSON.stringify({ type: 'doujin', doujin: { id, cover, lang, title } } as Favorite) });

    if (!resp.ok) {
      toast({
        title: '發生錯誤',
        description: '嘗試更新api時發生錯誤',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: '成功',
      description: 'YA',
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
    void fetchAPI();
  }, []);

  return (
    <div>

      {mydata === 1
        ? (
            <Button
              size="icon"
              className="bg-amber-500 text-white"
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
