import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  const startTime = Date.now();
  
  try {
    logger.api.request('POST', '/api/login');
    await dbConnect();
    
    const body = await req.json();
    logger.debug('Login attempt started', { email: body.email });

    // Validasyon
    if (!body.email || !body.password) {
      logger.auth.loginAttempt(body.email || 'unknown', false, 'Missing credentials');
      return NextResponse.json(
        { error: 'E-posta ve şifre zorunludur' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email: body.email });
    if (!user) {
      logger.auth.loginAttempt(body.email, false, 'User not found');
      return NextResponse.json(
        { error: 'E-posta veya şifre hatalı' },
        { status: 401 }
      );
    }

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(body.password, user.passwordHash);
    if (!isMatch) {
      logger.auth.loginAttempt(body.email, false, 'Invalid password');
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
    };

    // Başarılı giriş logla
    logger.auth.loginAttempt(body.email, true);
    logger.info('Login successful', { userId: user._id.toString() }, user._id.toString(), 'LOGIN_SUCCESS');

    // Response oluştur
    const response = NextResponse.json({
      message: 'Giriş başarılı',
      token,
      user: userData
    });

    // Cookie'leri ayarla
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Production'da true
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60, // 7 gün
      path: '/'
    };
	
    // Token'ı HttpOnly cookie olarak ayarla
    response.cookies.set('token', token, cookieOptions);

    // Kullanıcı bilgilerini normal cookie olarak ayarla
    response.cookies.set('user', JSON.stringify(userData), {
      ...cookieOptions,
      httpOnly: false // Client-side erişim için
    });

    // API response logla
    const duration = Date.now() - startTime;
    logger.api.response('POST', '/api/login', 200, duration, user._id.toString());

    return response;

  } catch (error: any) {
    const duration = Date.now() - startTime;
    logger.api.error('POST', '/api/login', error);
    logger.api.response('POST', '/api/login', 500, duration);
    
    return NextResponse.json(
      { error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}
