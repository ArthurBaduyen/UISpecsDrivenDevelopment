import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { env } from './env';

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (
          credentials?.email === env.AUTH_DEMO_EMAIL &&
          credentials?.password === env.AUTH_DEMO_PASSWORD
        ) {
          return {
            id: 'demo-user',
            email: env.AUTH_DEMO_EMAIL,
            name: 'Demo User'
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.orgId = token.orgId ?? 'org-placeholder';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? 'demo-user';
        session.user.activeOrganizationId = (token.orgId as string) ?? 'org-placeholder';
      }
      return session;
    }
  },
  pages: {
    signIn: '/api/auth/signin'
  }
};

export default NextAuth(authOptions);
