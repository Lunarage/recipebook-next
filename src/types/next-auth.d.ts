/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import JWT, { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: number;
      username: string;
      name: string;
      email: string;
    };
  }
  interface User extends DefaultUser {
    id: number;
    username: string;
    name: string;
    email: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user: {
      id: number;
      username: string;
      name: string;
      email: string;
    };
  }
}
