'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Button } from '../ui/button';
import { useToast } from '../ui/hooks/use-toast';

interface HaveDoujin {
  id: string;
  title: string;
  thumbnail: string;
  lang: string;
  page: number;
}

const ALLOWED_EMAIL = 'killer.archie.0732@gmail.com';

export function AddFavoriteButton({ id, title, thumbnail, lang, page }: HaveDoujin) {
  void [thumbnail, lang, page];
  const session = useSession();
  const { toast } = useToast();

  const [mydata, setMyData] = useState<0 | 1>(0);

  const currentEmail = session.data?.user?.email ?? '';
  const isAllowed = currentEmail === ALLOWED_EMAIL;

  const addNew = async () => {
    if (!isAllowed) {
      return;
    }

    toast({
      title: 'Adding to favorites...',
      description: 'Please wait a moment.',
    });

    const resp = await fetch(`/api/nhentai/${id}/favorite`, {
      method: 'POST',
    });

    if (!resp.ok) {
      toast({
        title: 'Add failed',
        description: 'nHentai favorite API request failed.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Added to favorites',
      description: `Saved: ${title}`,
    });
    setMyData(1);
  };

  useEffect(() => {
    const fetchAPI = async () => {
      if (!isAllowed) {
        setMyData(0);
        return;
      }

      const res = await fetch(`/api/nhentai/${id}/favorite`);
      if (!res.ok) {
        setMyData(0);
        return;
      }

      const data = await res.json() as { favorited?: boolean };

      if (data.favorited) {
        setMyData(1);
      }
      else {
        setMyData(0);
      }
    };

    void fetchAPI();
  }, [id, isAllowed]);

  if (session.status === 'loading') {
    return (
      <Button
        size="icon"
        variant="secondary"
        disabled
      >
        <Star />
      </Button>
    );
  }

  if (!isAllowed) {
    return (
      <Button
        size="icon"
        variant="secondary"
        disabled
        title="只有管理員可以操作收藏"
      >
        <Star />
      </Button>
    );
  }

  return (
    <div>
      {mydata === 1
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
