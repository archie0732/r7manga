/* import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';

import GoogleProvider from 'next-auth/providers/google';
import NextAuth from 'next-auth';

export const authOptions = {
  adapter: DrizzleAdapter(db),
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
    }),
    // ...add more providers here
  ],
};
export default NextAuth(authOptions); */

import { handlers } from '@/auth';

export const { GET, POST } = handlers;
