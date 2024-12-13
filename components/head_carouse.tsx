import { GithubButton } from './githubButton';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppStore } from '@/stores/app';

import Image from 'next/image';
import Link from 'next/link';

export function HeaderDemo() {
  const appStore = useAppStore();
  return (
    <header className="mt-0 p-4 flex justify-between select-none ">

      <Link href="/">
        <div className="flex">
          <Image className="filter invert mr-3" src="/book.svg" alt="book logo" width={30} height={40} />
          <h1 className="text-white text-xl sm:text-3xl font-semibold flex-row">
            R7 Manga
          </h1>
          <p className="text-white sm:text-sm ">by archie0732</p>
        </div>
      </Link>
      <div className="flex items-center space-x-2">
        <GithubButton />
        <Switch
          id="protect-mode"
          defaultChecked={appStore.protect}
          onCheckedChange={() => appStore.toggleProtect()}
          className="data-[state=unchecked]:bg-slate-500 data-[state=checked]:bg-cyan-600 border border-white"
        />
        <Label htmlFor="protect-mode" className="text-white">Protect Mode</Label>
      </div>
    </header>
  );
}
