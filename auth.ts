import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GoogleProvider(
    {
      clientId: process.env.AUTH_GOOGLE_ID ?? '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
    },
  )],
});
