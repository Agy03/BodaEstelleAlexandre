import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Credenciales hardcodeadas para los novios
        // Usuario: estelle-alexandre
        // Contraseña: boda2025
        const validUsername = 'estelle-alexandre';
        
        // Para desarrollo, puedes usar comparación simple:
        if (
          credentials.username === validUsername &&
          credentials.password === 'boda2025'
        ) {
          return {
            id: '1',
            name: 'Estelle & Alexandre',
            email: 'novios@boda.com',
            role: 'admin',
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
