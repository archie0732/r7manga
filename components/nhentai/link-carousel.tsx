import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Link from 'next/link';

interface idProp {
  id: string;
  title: string;
}

export function LinkCarouselDemo({ id, title }: idProp) {
  void title;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>其他功能</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/n/${id}/related`}>
          <DropdownMenuItem>查看 nhentai 相關</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>在 紳士漫畫 搜尋</DropdownMenuItem>
        <Link href={`https://nhentai.net/g/${id}`}>
          <DropdownMenuItem>前往原網站</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
