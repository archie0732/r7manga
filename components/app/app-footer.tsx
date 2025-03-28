'use client';

import { SiGithub } from '@icons-pack/react-simple-icons';
import { Computer, Moon, Sun } from 'lucide-react';
import { GithubButton } from '@/components/button/github-button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import Row from '../layout/row';
import Link from 'next/link';

export default function AppFooter() {
  const { setTheme } = useTheme();
  return (
    <footer className={
      `
        mt-10 flex flex-col items-center justify-between border-t p-8
        text-muted-foreground
        md:flex-row
      `
    }
    >
      <Row className="gap-4">
        <span>r7 &copy; 2024</span>
        <Row>
          <GithubButton />
        </Row>
      </Row>
      <Row className="gap-4">
        <Link href="https://github.com/archie0732/r7manga">
          <SiGithub />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className={`
                h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all
                dark:-rotate-90 dark:scale-0
              `}
              />
              <Moon className={`
                absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all
                dark:rotate-0 dark:scale-100
              `}
              />
              <span className="sr-only">切換主題</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setTheme('light'); }}>
              <Sun />
              <span>淺色</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setTheme('dark'); }}>
              <Moon />
              <span>深色</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setTheme('system'); }}>
              <Computer />
              <span>系統</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Row>
    </footer>
  );
}
