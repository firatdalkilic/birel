import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    console.log('Giriş API çağrısı başladı');
    await dbConnect();
    
    const body = await req.json();
    console.log('Gelen veri:', { ...body, password: '[GİZLENDİ]' });

    // Validasyon
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre zorunludur' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email: body.email });
    if (!user) {
      console.log('Kullanıcı bulunamadı:', body.email);
      return NextResponse.json(
        { error: 'E-posta veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(body.password, user.passwordHash);
    if (!isMatch) {
      console.log('Şifre eşleşmedi:', body.email);
      return NextResponse.json(
        { error: 'E-posta veya şifre hatalı' },
        { status: 401 }
      );
    }

    // JWT token oluşturma
    const token = jwt.sign(
      { 
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.lastSelectedRole
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    // Kullanıcı bilgilerini hazırla
    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.lastSelectedRole
    };

    // Response oluştur
    const response = NextResponse.json({
      message: 'Giriş başarılı',
      token,
      user: userData
    });

    // Cookie'leri ayarla
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60, // 7 gün
      path: '/',
    };

    // Token ve kullanıcı bilgilerini cookie olarak ayarla
    response.cookies.set('token', token, cookieOptions);
    response.cookies.set('user', JSON.stringify(userData), {
      ...cookieOptions,
      httpOnly: false // Client-side'dan erişilebilir olması için
    });

    // Rol seçimi için cookie'ler
    if (user.lastSelectedRole) {
      response.cookies.set('selectedRole', user.lastSelectedRole, {
        ...cookieOptions,
        httpOnly: false
      });
      response.cookies.set('hasSelectedInitialRole', 'true', {
        ...cookieOptions,
        httpOnly: false
      });
    }

    return response;

  } catch (error: any) {
    console.error('API hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}