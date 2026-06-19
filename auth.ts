import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { getAdminIdentity } from '@/lib/auth/admin';

const adminIdentity = getAdminIdentity(process.env as Record<string, string | undefined>);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: 'Local Admin',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        const username = credentials.username?.toString() ?? '';
        const password = credentials.password?.toString() ?? '';

        if (username !== adminIdentity.username || password !== adminIdentity.password) {
          return null;
        }

        return {
          id: 'local-admin',
          name: adminIdentity.username,
          email: adminIdentity.email,
          role: 'admin',
        };
      },
    }),
    GoogleProvider(
      {
        clientId: process.env.AUTH_GOOGLE_ID ?? '',
        clientSecret: process.env.AUTH_GOOGLE_SECRET ?? '',
      },
    ),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user && 'role' in user) {
        token.role = typeof user.role === 'string' ? user.role : 'user';
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        Object.assign(session.user, {
          role: typeof token.role === 'string' ? token.role : 'user',
        });
      }

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
