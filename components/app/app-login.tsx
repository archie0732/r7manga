'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '../ui/button';
import { Album, LogIn, User } from 'lucide-react';
import { Avatar, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuItem } from '../ui/dropdown-menu';
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu';

export function Login() {
  const session = useSession();

  const avatar = session.data?.user?.image;

  return (
    <div>
      {
        avatar
          ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="size-8">
                    <AvatarImage src={avatar} />
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{session.data?.user?.name ?? 'user'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User />
                      查看個人檔案
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Album />
                      查看收藏
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => void signOut()}>
                      登出
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          : (
              <Button
                title="登入"
                type="submit"
                onClick={() => {
                  void signIn('google');
                }}
                variant="outline"
              >
                <LogIn />
              </Button>
            )

      }
    </div>
  );
}
