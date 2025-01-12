'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/stores/app';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Ellipsis } from 'lucide-react';

interface idProps {
  id: string;
}

export function APPPageSelection({ id }: idProps) {
  const protectMode = useAppStore();
  const router = useRouter();

  const protect = () => {
    protectMode.toggleProtect(!protectMode.protect);
  };
  const home = () => {
    router.push('/');
  };
  const overview = () => {
    router.push(`/n/${id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline"><Ellipsis /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>看漫小工具</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={overview}>回預覽</DropdownMenuItem>
          <DropdownMenuItem onClick={home}>回首頁</DropdownMenuItem>
          <DropdownMenuItem onClick={protect}>切換保護模式</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
