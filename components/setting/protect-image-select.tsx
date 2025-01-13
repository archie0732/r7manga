'use client';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useAppStore } from '@/stores/app';
import Image from 'next/image';

export function ProtectImageSelect() {
  const { protectImage, setProtectImage } = useAppStore();
  return (
    <div className="flex gap flex-col">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Image
            src={protectImage}
            width={80}
            height={80}
            alt="protect picture"
            className="m-1 ml-auto rounded-lg"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-center text-sm">
          <DropdownMenuLabel>Select Image</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setProtectImage('/img/1210.png')}>Blank Nice</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setProtectImage('/img/1280.png')}>Midoriya</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setProtectImage('/img/20250108.jpg')}>Yoimiya</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setProtectImage('/img/8_20250113-2.jpg')}>Yanami anna</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
}
