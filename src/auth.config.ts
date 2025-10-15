import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
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
        const validPasswordHash = '$2a$10$mQxK0YPL6YvKJXZZP9GKJeH1yGKJh5F5ZmFvZxQvKJXZZP9GKJeH1y'; // "boda2025" hasheado
        
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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnLogin = nextUrl.pathname.startsWith('/admin/login');

      if (isOnAdmin && !isOnLogin) {
        if (!isLoggedIn) {
          return false; // Redirige a login
        }
        return true;
      }

      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL('/admin', nextUrl));
      }

      return true;
    },
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
