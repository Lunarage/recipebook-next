import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma/prisma';
// import GithubProvider from 'next-auth/providers/github';
// import EmailProvider from 'next-auth/providers/email';

interface Credentials {
  password: string;
  username: string;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60, // 15 minutes
  },
  jwt: { secret: process.env.SECRET },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as User;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
  providers: [
    // EmailProvider({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: '' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { username, password } = credentials as Credentials;

        if (username === null || password === null) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              username,
            },
            select: {
              email: true,
              id: true,
              name: true,
              password: true,
              username: true,
            },
          });
          if (!user) {
            return null;
          }

          if (await bcrypt.compare(password, user.password)) {
            return {
              email: user.email,
              id: user.id,
              name: user.name,
              username: user.username,
            } as User;
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

export default NextAuth(authOptions);
