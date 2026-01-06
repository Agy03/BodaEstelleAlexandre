import { auth } from '@/auth';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['es', 'en', 'fr'],
  defaultLocale: 'es',
  localePrefix: 'as-needed'
});

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLogin = req.nextUrl.pathname.startsWith('/admin/login');
  const isOnAdminDashboard = req.nextUrl.pathname === '/admin' || 
    (req.nextUrl.pathname.startsWith('/admin') && !isOnLogin);

  // Permitir siempre acceso a /admin/login
  if (isOnLogin) {
    return intlMiddleware(req);
  }

  // Proteger solo el dashboard /admin y sus sub-rutas (excepto login)
  if (isOnAdminDashboard && !isLoggedIn) {
    return Response.redirect(new URL('/admin/login', req.nextUrl));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ],
};
