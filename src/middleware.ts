import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/webhooks/')) {
    return NextResponse.next();
  }

  // Token kontrolü
  const token = request.cookies.get('token')?.value;

  // Static dosyalar ve API routes için bypass
  if (
    path.startsWith('/_next') ||
    path.startsWith('/next') ||  // ← Bu satırı ekleyin
    path.startsWith('/static') ||
    path.startsWith('/api/') ||
    path.includes('favicon.ico') ||
    path.includes('.svg') ||
    path.includes('.png') ||
    path.includes('.jpg') ||
    path.includes('.jpeg') ||
    path.includes('.gif') ||
    path.includes('.js') ||     // ← Bu satırı ekleyin
    path.includes('.css') ||    // ← Bu satırı ekleyin
    path.includes('.woff') ||   // ← Bu satırı ekleyin
    path.includes('.woff2')     // ← Bu satırı ekleyin
  ) {
    return NextResponse.next();
  }

  // Public routes - her zaman erişilebilir
  const publicRoutes = ['/', '/giris', '/kayit', '/gizlilik', '/kvkk', '/sss', '/iletisim'];
  
  // Public route kontrolü
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Token yoksa giriş sayfasına yönlendir
  if (!token) {
    return NextResponse.redirect(new URL('/giris', request.url));
  }

  // Token varsa devam et
  return NextResponse.next();
}

// Middleware'in çalışacağı path'leri belirle
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|webhooks).*)',
  ],
};
