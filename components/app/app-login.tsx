/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { signIn } from '@/auth';
import { Button } from '../ui/button';

export function Login() {
  return (
    <Button
      type="submit"
      onClick={async () => {
        'use server';
        await signIn('google');
      }}
    >
      Google
    </Button>

  );
}
