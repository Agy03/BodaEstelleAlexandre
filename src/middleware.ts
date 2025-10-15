import { auth } from '@/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdmin = req.nextUrl.pathname.startsWith('/admin');
  const isOnLogin = req.nextUrl.pathname.startsWith('/admin/login');

  // Proteger rutas /admin/* excepto /admin/login
  if (isOnAdmin && !isOnLogin && !isLoggedIn) {
    return Response.redirect(new URL('/admin/login', req.nextUrl));
  }

  // Si ya está logueado y trata de ir a /admin/login, redirigir a /admin
  if (isOnLogin && isLoggedIn) {
    return Response.redirect(new URL('/admin', req.nextUrl));
  }

  return undefined;
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
