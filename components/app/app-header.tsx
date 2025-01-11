import { SidebarTrigger } from '@/components/ui/sidebar';

import Link from 'next/link';
import Row from '@/components/layout/row';
import { ProtectProps } from './app-protect';
import { Login } from './app-login';
import { Search } from './app-search';

export function AppHeader() {
  return (
    <header className="mt-0 flex select-none justify-between p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Link href="/">
          <div className="flex">
            <h1 className={`
              mr-1 flex-row text-xl font-semibold
              sm:text-3xl
            `}
            >
              R7 Manga
            </h1>
          </div>
        </Link>
      </div>
      <Row className="gap-2">
        <Search />
        <Login />
        <ProtectProps />
      </Row>
    </header>
  );
}
