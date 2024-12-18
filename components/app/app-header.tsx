'use client';
import { Book, Moon, Search, Sun } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppStore } from '@/stores/app';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import Link from 'next/link';

export function AppHeader() {
  const appStore = useAppStore();
  const { setTheme } = useTheme();
  return (
    <header className="mt-0 p-4 flex justify-between select-none ">
      <div className="flex gap-2 items-center">
        <SidebarTrigger>
          <Book />
        </SidebarTrigger>
        <Link href="/">
          <div className="flex">
            <h1 className=" text-xl sm:text-3xl font-semibold flex-row mr-1">
              R7 Manga
            </h1>
          </div>
        </Link>
      </div>
      <div>
        <Button
          variant="outline"
          className="flex justify-start gap-2 w-[20svw] text-muted-foreground"
          onClick={() => appStore.setCommandPanelVisible(true)}
        >
          <Search />
          <span>搜尋</span>
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">切換主題</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Switch
          id="protect-mode"
          defaultChecked={appStore.protect}
          onCheckedChange={() => appStore.toggleProtect()}
          className="data-[state=unchecked]:bg-slate-500 data-[state=checked]:bg-cyan-600 border border-white"
        />
        <Label htmlFor="protect-mode">Protect Mode</Label>
      </div>
    </header>
  );
}
