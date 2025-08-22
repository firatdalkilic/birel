import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware çalıştı:', request.nextUrl.pathname);
  
  // Token kontrolü
  const token = request.cookies.get('token')?.value || 
                localStorage.getItem('token') || 
                request.headers.get('Authorization')?.split(' ')[1];
                
  console.log('Token durumu:', !!token);

  // URL'den path'i al
  const path = request.nextUrl.pathname;

  // Public routes - her zaman erişilebilir
  const publicRoutes = ['/', '/giris', '/kayit'];
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // API routes - auth kontrolü yapma
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Token yoksa giriş sayfasına yönlendir
  if (!token) {
    console.log('Token yok, giriş sayfasına yönlendiriliyor');
    return NextResponse.redirect(new URL('/giris', request.url));
  }

  // Token varsa devam et
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};