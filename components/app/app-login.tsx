'use client';
import { signIn } from 'next-auth/react';
import { Button } from '../ui/button';
import { LogIn } from 'lucide-react';

export function Login() {
  return (
    <Button
      type="submit"
      onClick={() => {
        void signIn('google');
      }}
      variant="outline"
    >
      <LogIn />
    </Button>

  );
}
