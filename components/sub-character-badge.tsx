'use client';
import { TagData } from '@/app/api/nhentai/[doujin]/route';
import { Badge } from '@/components/ui/badge';

import Row from './layout/row';
import Link from 'next/link';
import { useAppStore } from '@/stores/app';
import { useToast } from './ui/hooks/use-toast';
import { useEffect, useState } from 'react';
import { FavoriteAdd, FavoriteData } from '@/app/api/favorite/_model/apitype';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

type Props = Readonly<{
  tag: TagData[];
  label: string;
  icon: React.ReactNode;

}>;

export function SubCharacterTagedDemo({ tag, label, icon }: Props) {
  const { kindkey } = useAppStore();
  const { toast } = useToast();
  const [check, setCheck] = useState<boolean>(false);
  const [doujin, setDoujin] = useState<FavoriteData>();
  const [followedCharacters, setFollowedCharacters] = useState(new Set<string>()); // ✅ 用 Set 來存追蹤的角色

  void doujin;

  // ✅ 加入新角色
  const addNew = async (character: string) => {
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

    setFollowedCharacters((prev) => new Set(prev).add(character));

    const resp = await fetch('/api/favorite', {
      method: 'POST',
      body: JSON.stringify({ type: 'character', character } as FavoriteAdd),
    });

    if (!resp.ok) {
      toast({
        title: '發生錯誤',
        description: '嘗試更新 API 時發生錯誤',
        variant: 'destructive',
      });

      // ✅ 如果 API 失敗，回復原狀
      setFollowedCharacters((prev) => {
        const updated = new Set(prev);
        updated.delete(character);
        return updated;
      });

      return;
    }

    toast({
      title: '追蹤角色',
      description: `成功追蹤角色: ${character}`,
    });
  };

  // ✅ 獲取收藏的角色
  const fetchAPI = async () => {
    const res = await fetch('/api/yanami');
    const doujin = await res.json() as FavoriteData;
    setDoujin(doujin);

    // ✅ 初始化已追蹤角色
    const followed = new Set(doujin.favorite_nhentai.character);
    setFollowedCharacters(followed);
  };

  useEffect(() => {
    const checkKey = async () => {
      const res = await fetch('/api/keyCheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: kindkey }),
      });

      setCheck(res.ok);
    };

    void fetchAPI();
    void checkKey();
  }, []);

  return (
    <div className="flex gap-2">
      <Row className="gap-2">
        {icon}
        <span>{label}</span>
      </Row>
      <div className="flex flex-wrap gap-2">
        {tag.map((tag) => {
          const isFiltered = followedCharacters.has(tag.name); // ✅ 直接查詢狀態

          return (
            <DropdownMenu key={tag.name}>
              <DropdownMenuTrigger>
                <Badge
                  variant="secondary"
                  className={isFiltered
                    ? `
                      bg-blue-900
                      hover:bg-blue-500
                    `
                    : ''}
                >
                  {tag.name}
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>標籤選單</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => void addNew(tag.name)}
                  disabled={isFiltered}
                >
                  {isFiltered ? '已經追蹤角色' : '追蹤角色'}
                </DropdownMenuItem>
                <Link href={`/search?character=${tag.name}`}>
                  <DropdownMenuItem>查詢角色</DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        })}
      </div>
    </div>
  );
}
