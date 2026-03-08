import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLogin = req.nextUrl.pathname.startsWith('/admin/login');
  const isOnAdminDashboard = req.nextUrl.pathname === '/admin' || 
    (req.nextUrl.pathname.startsWith('/admin') && !isOnLogin);

  // Permitir siempre acceso a /admin/login
  if (isOnLogin) {
    return NextResponse.next();
  }

  // Proteger solo el dashboard /admin y sus sub-rutas (excepto login)
  if (isOnAdminDashboard && !isLoggedIn) {
    return Response.redirect(new URL('/admin/login', req.nextUrl));
  }

  return NextResponse.next();
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
