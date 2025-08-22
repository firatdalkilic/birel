import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Token kontrolü
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.split(' ')[1];
  const selectedRole = request.cookies.get('selectedRole')?.value || '';
  const hasSelectedInitialRole = request.cookies.get('hasSelectedInitialRole')?.value === 'true';

  // URL'den path'i al
  const path = request.nextUrl.pathname;

  // Giriş yapmamış kullanıcıları giriş sayfasına yönlendir
  if (!token && path !== '/giris' && path !== '/kayit' && path !== '/') {
    return NextResponse.redirect(new URL('/giris', request.url));
  }

  // Giriş yapmış kullanıcıları ana sayfadan rol seçimine yönlendir
  if (token && path === '/' && !hasSelectedInitialRole) {
    return NextResponse.redirect(new URL('/rol-sec', request.url));
  }

  // Giriş yapmış ve rol seçmiş kullanıcıları dashboard'a yönlendir
  if (token && path === '/' && hasSelectedInitialRole && selectedRole) {
    return NextResponse.redirect(new URL(`/dashboard/${selectedRole}`, request.url));
  }

  // Rol seçimi yapılmışsa ve rol seçim sayfasına tekrar gelmeye çalışıyorsa dashboard'a yönlendir
  if (token && path === '/rol-sec' && hasSelectedInitialRole && selectedRole) {
    return NextResponse.redirect(new URL(`/dashboard/${selectedRole}`, request.url));
  }

  // Yanlış role sahip kullanıcıları doğru dashboard'a yönlendir
  if (token && path.startsWith('/dashboard/')) {
    const urlRole = path.split('/')[2]; // /dashboard/gorevli -> gorevli
    if (selectedRole && urlRole !== selectedRole) {
      return NextResponse.redirect(new URL(`/dashboard/${selectedRole}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
