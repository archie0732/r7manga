'use client';

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { useAppStore } from '@/stores/app';
import { Book, BookHeart, Check, Home, Paintbrush2, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export type SearchWebsite = 'nhentai' | 'ehentai';

export const buildCommandSearchTarget = (keyword: string, website: SearchWebsite) => {
  if (/^\d+$/.test(keyword)) {
    return `/n/${keyword}`;
  }

  const query = new URLSearchParams({ q: keyword });

  if (website === 'ehentai') {
    query.set('w', 'e');
  }

  return `/search?${query.toString()}`;
};

export default function AppCommand() {
  const router = useRouter();
  const commandPanelVisible = useAppStore((state) => state.commandPanelVisible);
  const setCommandPanelVisible = useAppStore((state) => state.setCommandPanelVisible);
  const [keyword, setKeyword] = useState('');
  const [searchWebsite, setSearchWebsite] = useState<SearchWebsite>('nhentai');
  const { setTheme, theme } = useTheme();

  const changeTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    }
    else {
      setTheme('dark');
    }
  };

  const handleSearch = () => {
    router.push(buildCommandSearchTarget(keyword, searchWebsite));
    setCommandPanelVisible(false);
  };

  return (
    <CommandDialog
      open={commandPanelVisible}
      onOpenChange={setCommandPanelVisible}
    >
      <CommandInput
        placeholder="Search manga..."
        value={keyword}
        onValueChange={setKeyword}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => {
            router.push('/');
            setCommandPanelVisible(false);
          }}
          >
            <Home />
            <span>Home</span>
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
        <CommandGroup heading="Search Website">
          <CommandItem onSelect={() => { setSearchWebsite('nhentai'); }}>
            <BookHeart />
            <span>nhentai</span>
            {searchWebsite === 'nhentai' ? <Check className="ml-auto" /> : null}
          </CommandItem>
          <CommandItem onSelect={() => { setSearchWebsite('ehentai'); }}>
            <Book />
            <span>ehentai</span>
            {searchWebsite === 'ehentai' ? <Check className="ml-auto" /> : null}
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={changeTheme}>
            <Paintbrush2 />
            <span>Toggle theme</span>
          </CommandItem>
        </CommandGroup>
        {keyword.length > 0 && (
          <CommandItem onSelect={handleSearch}>
            {/^\d+$/.test(keyword) ? <Book /> : <Search />}
            <span>
              {/^\d+$/.test(keyword) ? 'Open' : `Search ${searchWebsite}`}
              <strong>
                {' '}
                "{keyword}"
              </strong>
            </span>
          </CommandItem>
        )}
      </CommandList>
    </CommandDialog>
  );
}
