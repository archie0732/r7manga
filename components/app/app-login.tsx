'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Album, LogIn, User } from 'lucide-react';

import { isAdminUser } from '@/lib/auth/admin';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';

export function Login() {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const user = session.data?.user;
  const isLoggedIn = Boolean(user);
  const isAdmin = isAdminUser(user);

  const loginWithCredentials = async () => {
    setPending(true);
    setError('');

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setError('帳號或密碼錯誤');
      setPending(false);
      return;
    }

    setOpen(false);
    setUsername('');
    setPassword('');
    setPending(false);
  };

  return (
    <div>
      {isLoggedIn
        ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="size-8">
                  <AvatarImage src={user?.image ?? undefined} />
                  <AvatarFallback>{user?.name?.slice(0, 1).toUpperCase() ?? 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user?.name ?? 'user'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User />
                    個人資料
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Album />
                    {isAdmin ? '管理員' : '一般使用者'}
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
            <Dialog open={open} onOpenChange={setOpen}>
              <Button
                title="登入"
                type="button"
                onClick={() => { setOpen(true); }}
                variant="outline"
              >
                <LogIn />
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>管理員登入</DialogTitle>
                  <DialogDescription>輸入本地管理員帳號後，可以查看、新增、刪除收藏。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <Input
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        void loginWithCredentials();
                      }
                    }}
                  />
                  {error
                    ? <span className="text-sm text-red-500">{error}</span>
                    : null}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => void signIn('google')}>
                    Google Login
                  </Button>
                  <Button onClick={() => void loginWithCredentials()} disabled={pending}>
                    {pending ? '登入中...' : '登入'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
    </div>
  );
}
