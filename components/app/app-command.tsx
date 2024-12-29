'use client';

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { useAppStore } from '@/stores/app';
import { Book, BookHeart, Home, Paintbrush2, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AppCommand() {
  const router = useRouter();
  const commandPanelVisible = useAppStore((state) => state.commandPanelVisible);
  const setCommandPanelVisible = useAppStore((state) => state.setCommandPanelVisible);
  const [keyword, setKeyword] = useState('');
  const { setTheme, theme } = useTheme();

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
        value={keyword}
        onValueChange={setKeyword}
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
        {keyword.length > 0 && !/^\d+$/.test(keyword) && (
          <CommandItem onSelect={() => {
            { /* TO Do fix to handle other side */ }
            router.push(`/search?q=${keyword}`);
            setCommandPanelVisible(false);
          }}
          >
            <Search />
            <span>
              搜尋
              <strong>
                「
                {keyword}
                」
              </strong>
            </span>
          </CommandItem>
        )}
        {keyword.length > 0 && /^\d+$/.test(keyword) && (
          <CommandItem onSelect={() => {
            router.push(`/n/${keyword}`);
            setCommandPanelVisible(false);
          }}
          >
            <Book />
            <span>
              前往
              <strong>
                「
                {keyword}
                」
              </strong>
            </span>
          </CommandItem>
        )}
      </CommandList>
    </CommandDialog>
  );
}
