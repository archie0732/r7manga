'use client';

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { useAppStore } from '@/stores/app';
import { BookHeart, Home, Paintbrush2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AppCommand() {
  const router = useRouter();
  const commandPanelVisible = useAppStore((state) => state.commandPanelVisible);
  const setCommandPanelVisible = useAppStore((state) => state.setCommandPanelVisible);
  const { setTheme, theme } = useTheme();
  const [keyword, setKeyword] = useState<string>('*');
  const changeTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    }
    else {
      setTheme('dark');
    }
  };

  return (
    <CommandDialog
      open={commandPanelVisible}
      onOpenChange={setCommandPanelVisible}
    >
      <CommandInput
        placeholder="搜尋或輸入指令..."
        onValueChange={(e) => { setKeyword(e); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            router.push(`/search?q=${keyword}`);
            setCommandPanelVisible(false);
          }
        }}
      />
      <CommandList>
        <CommandEmpty>沒有結果</CommandEmpty>
        <CommandGroup heading="建議">
          <CommandItem onSelect={() => {
            router.push('/');
            setCommandPanelVisible(false);
          }}
          >
            <Home />
            <span>首頁</span>
          </CommandItem>
          <CommandItem onSelect={() => {
            router.push('/n/');
            setCommandPanelVisible(false);
          }}
          >
            <BookHeart />
            <span>nhentai</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="設定">
          <CommandItem>
            <Paintbrush2 />
            <span onClick={changeTheme}>變更主題色</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
