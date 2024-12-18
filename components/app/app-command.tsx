'use client';

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { useAppStore } from '@/stores/app';
import { Home, Paintbrush2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AppCommand() {
  const router = useRouter();
  const commandPanelVisible = useAppStore((state) => state.commandPanelVisible);
  const setCommandPanelVisible = useAppStore((state) => state.setCommandPanelVisible);
  return (
    <CommandDialog
      open={commandPanelVisible}
      onOpenChange={setCommandPanelVisible}
    >
      <CommandInput placeholder="搜尋或輸入指令..." />
      <CommandList>
        <CommandEmpty>沒有結果</CommandEmpty>
        <CommandGroup heading="建議">
          <CommandItem onSelect={() => router.push('/')}>
            <Home />
            <span>首頁</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="設定">
          <CommandItem>
            <Paintbrush2 />
            <span>變更主題色</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
