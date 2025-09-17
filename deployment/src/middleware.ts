import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // ✅ Webhook'ları BYPASS ET
  if (path.startsWith('/webhooks/')) {
    return NextResponse.next();
  }

  // Static dosyalar ve API routes için bypass
  if (
    path.startsWith('/_next') ||
    path.startsWith('/next') ||
    path.startsWith('/static') ||
    path.startsWith('/api/') ||
    path.includes('favicon.ico') ||
    path.includes('.svg') ||
    path.includes('.png') ||
    path.includes('.jpg') ||
    path.includes('.jpeg') ||
    path.includes('.gif') ||
    path.includes('.js') ||
    path.includes('.css') ||
    path.includes('.woff') ||
    path.includes('.woff2')
  ) {
    return NextResponse.next();
  }

  // Public routes - her zaman erişilebilir
  const publicRoutes = ['/', '/gizlilik', '/kvkk', '/sss', '/iletisim'];
  
  // Public route kontrolü
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Token kontrolü - cookie'den kontrol et
  const token = request.cookies.get('token')?.value;
  const selectedRole = request.cookies.get('selectedRole')?.value;

  // Giriş ve kayıt sayfaları için özel kontrol
  if (path === '/giris' || path === '/kayit') {
    if (!token) {
      // Token yoksa sayfaya git
      return NextResponse.next();
    }
    
    // Token varsa doğrula
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret');
      await jwtVerify(token, secret);
      
      // Token geçerli - otomatik yönlendirme yap
      if (selectedRole) {
        return NextResponse.redirect(new URL(`/dashboard/${selectedRole}`, request.url));
      } else {
        return NextResponse.redirect(new URL('/rol-sec', request.url));
      }
    } catch (error) {
      // Token geçersiz - sayfaya git
      return NextResponse.next();
    }
  }

  // Token yoksa giriş sayfasına yönlendir
  if (!token) {
    return NextResponse.redirect(new URL('/giris', request.url));
  }

  // Token varsa JWT doğrulaması yap
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret');
    await jwtVerify(token, secret);
    
    // Token geçerli - devam et
    return NextResponse.next();
  } catch (error) {
    // Token geçersiz veya süresi bitti
    console.log('Geçersiz token:', error);
    
    const response = NextResponse.next();
    
    // Cookie'leri temizle
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 0,
      path: '/'
    };

    response.cookies.set('token', '', cookieOptions);
    response.cookies.set('user', '', {
      ...cookieOptions,
      httpOnly: false
    });
    response.cookies.set('selectedRole', '', {
      ...cookieOptions,
      httpOnly: false
    });

    // Giriş sayfasına yönlendir
    return NextResponse.redirect(new URL('/giris', request.url));
  }
}

// Middleware'in çalışacağı path'leri belirle
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|webhooks/).*)',
  ],
};
