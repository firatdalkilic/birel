import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Token kontrolü
  const token = request.cookies.get('token')?.value || 
                request.headers.get('Authorization')?.split(' ')[1];

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
  
  // Ana sayfa özel kontrolü
  if (path === '/') {
    return NextResponse.next(); // Ana sayfaya her zaman izin ver
  }

  // Diğer public route'lar için kontrol
  if (publicRoutes.includes(path)) {
    // Eğer token varsa ve giriş/kayıt sayfalarındaysa rol seçimine yönlendir
    if (token && (path === '/giris' || path === '/kayit')) {
      return NextResponse.redirect(new URL('/rol-sec', request.url));
    }
    return NextResponse.next();
  }

  // Token yoksa ve korumalı bir sayfaya erişmeye çalışıyorsa giriş sayfasına yönlendir
  if (!token) {
    return NextResponse.redirect(new URL('/giris', request.url));
  }

  // Rol seçim sayfası kontrolü
  if (path === '/rol-sec') {
    // Token yoksa giriş sayfasına yönlendir
    if (!token) {
      return NextResponse.redirect(new URL('/giris', request.url));
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