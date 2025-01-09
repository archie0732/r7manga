'use client';
import { useAppStore } from '@/stores/app';
import { Button } from '../ui/button';
import { SearchIcon } from 'lucide-react';

export function Search() {
  const appStore = useAppStore();
  return (
    <Button
      variant="outline"
      size="icon"
      className={`
        flex gap-2 text-muted-foreground
        md:h-9 md:w-[12svw] md:justify-start md:px-4 md:py-2
      `}
      onClick={() => { appStore.setCommandPanelVisible(true); }}
    >
      <SearchIcon />
      <span className={`
        hidden
        md:inline
      `}
      >
        搜尋
      </span>
    </Button>
  );
}
