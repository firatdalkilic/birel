import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Token kontrolü
  const token = request.cookies.get('token')?.value;

  // URL'den path'i al
  const path = request.nextUrl.pathname;

  // Static dosyalar ve API routes için bypass
  if (
    path.startsWith('/_next') ||
    path.startsWith('/static') ||
    path.startsWith('/api/') ||
    path.includes('favicon.ico') ||
    path.includes('.svg') ||
    path.includes('.png') ||
    path.includes('.jpg') ||
    path.includes('.jpeg') ||
    path.includes('.gif')
  ) {
    return NextResponse.next();
  }

  // Public routes - her zaman erişilebilir
  const publicRoutes = ['/', '/giris', '/kayit', '/gizlilik', '/kvkk', '/sss', '/iletisim'];
  
  // Public route kontrolü
  if (publicRoutes.includes(path)) {
    // Giriş yapmış kullanıcılar giriş/kayıt sayfalarına giremez
    if (token && (path === '/giris' || path === '/kayit')) {
      const selectedRole = request.cookies.get('selectedRole')?.value;
      if (selectedRole) {
        return NextResponse.redirect(new URL(`/dashboard/${selectedRole}`, request.url));
      }
      return NextResponse.redirect(new URL('/rol-sec', request.url));
    }
    return NextResponse.next();
  }

  // Token yoksa giriş sayfasına yönlendir
  if (!token) {
    return NextResponse.redirect(new URL('/giris', request.url));
  }

  // Dashboard route kontrolü
  if (path.startsWith('/dashboard/')) {
    const selectedRole = request.cookies.get('selectedRole')?.value;
    if (!selectedRole) {
      return NextResponse.redirect(new URL('/rol-sec', request.url));
    }
    return NextResponse.next();
  }

  // Token varsa devam et
  return NextResponse.next();
}

// Middleware'in çalışacağı path'leri belirle
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};