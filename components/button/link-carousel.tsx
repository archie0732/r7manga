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

interface urlProp {
  selfRelateURL: string;
  outRelateURL: string;
}

export function LinkCarouselDemo({ selfRelateURL }: urlProp) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger><EllipsisVertical /></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>related</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={selfRelateURL}>
          <DropdownMenuItem>nhentai</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>紳士漫畫</DropdownMenuItem>
        <DropdownMenuItem>hitomi</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
