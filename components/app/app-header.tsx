'use client';

import { Book, Search, Shield, ShieldOff } from 'lucide-react';
import { useAppStore } from '@/stores/app';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

import Link from 'next/link';
import { Toggle } from '@/components/ui/toggle';
import Row from '@/components/layout/row';

export function AppHeader() {
  const appStore = useAppStore();

  return (
    <header className="mt-0 p-4 flex justify-between select-none ">
      <div className="flex gap-2 items-center">
        <SidebarTrigger><Book /></SidebarTrigger>
        <Link href="/">
          <div className="flex">
            <h1 className=" text-xl sm:text-3xl font-semibold flex-row mr-1">
              R7 Manga
            </h1>
          </div>
        </Link>
      </div>
      <Row className="gap-2">
        <Button
          variant="outline"
          size="icon"
          className="flex md:justify-start gap-2 md:w-[12svw] text-muted-foreground md:h-9 md:px-4 md:py-2"
          onClick={() => appStore.setCommandPanelVisible(true)}
        >
          <Search />
          <span className="hidden md:inline">搜尋</span>
        </Button>
        <Toggle
          pressed={appStore.protect}
          onPressedChange={appStore.toggleProtect}
          variant="outline"
          className="data-[state=on]:bg-green-500 data-[state=off]:border-red-500 data-[state=off]:text-red-500"
        >
          {
            appStore.protect ? <Shield /> : <ShieldOff />
          }
        </Toggle>
      </Row>
    </header>
  );
}
