import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware çalıştı:', request.nextUrl.pathname);
  
  // Token kontrolü - sadece cookie ve header'dan kontrol et
  const token = request.cookies.get('token')?.value || 
                request.headers.get('Authorization')?.split(' ')[1];
                
  console.log('Token durumu:', !!token);

  // URL'den path'i al
  const path = request.nextUrl.pathname;

  // Ana sayfa için kontrol yapma
  if (path === '/') {
    return NextResponse.next();
  }

  // Public routes - her zaman erişilebilir
  if (path === '/giris' || path === '/kayit') {
    // Eğer token varsa ve giriş/kayıt sayfalarındaysa rol seçimine yönlendir
    if (token) {
      return NextResponse.redirect(new URL('/rol-sec', request.url));
    }
    return NextResponse.next();
  }

  // API routes - auth kontrolü yapma
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Static dosyalar için kontrol yapma
  if (
    path.startsWith('/_next') ||
    path.startsWith('/static') ||
    path.includes('favicon.ico') ||
    path.includes('.svg') ||
    path.includes('.png') ||
    path.includes('.jpg') ||
    path.includes('.jpeg') ||
    path.includes('.gif')
  ) {
    return NextResponse.next();
  }

  // Footer sayfaları için kontrol yapma
  if (
    path === '/gizlilik' ||
    path === '/kvkk' ||
    path === '/sss' ||
    path === '/iletisim'
  ) {
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

// Middleware'in çalışacağı path'leri belirle
export const config = {
  matcher: [
    /*
     * Match all paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};