import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'Çıkış başarılı'
    });

    // Cookie'leri temizle - aynı seçeneklerle unset et
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 0, // Hemen sil
      path: '/'
    };

    // Token cookie'sini sil
    response.cookies.set('token', '', cookieOptions);
    
    // User cookie'sini sil
    response.cookies.set('user', '', {
      ...cookieOptions,
      httpOnly: false // Client-side erişim için
    });

    // SelectedRole cookie'sini sil (eğer varsa)
    response.cookies.set('selectedRole', '', {
      ...cookieOptions,
      httpOnly: false
    });

    // RefreshToken cookie'sini sil (eğer varsa)
    response.cookies.set('refreshToken', '', cookieOptions);

    return response;
  } catch (error) {
    console.error('Logout hatası:', error);
    return NextResponse.json(
      { error: 'Çıkış sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
