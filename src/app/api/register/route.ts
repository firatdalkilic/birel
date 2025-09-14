import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  const startTime = Date.now();
  
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    logger.api.request('POST', '/api/register');
    await dbConnect();
    
    const body = await req.json();
    logger.debug('Register attempt started', { email: body.email });

    // Validasyon
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      logger.auth.registerAttempt(body.email || 'unknown', false, 'Missing required fields');
      return NextResponse.json(
        { error: 'Tüm zorunlu alanları doldurun' },
        { status: 400 }
      );
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      logger.auth.registerAttempt(body.email, false, 'Invalid email format');
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // Şifre uzunluğu kontrolü
    if (body.password.length < 6) {
      logger.auth.registerAttempt(body.email, false, 'Password too short');
      return NextResponse.json(
        { error: 'Şifreniz en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Telefon numarası formatı kontrolü
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
    const cleanPhone = body.phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      logger.auth.registerAttempt(body.email, false, 'Invalid phone format');
      return NextResponse.json(
        { error: 'Geçerli bir telefon numarası giriniz (5XX XXX XX XX)' },
        { status: 400 }
      );
    }

    // E-posta ve telefon kontrolü
    const existingUser = await User.findOne({ 
      $or: [
        { email: body.email },
        { phone: `+90${cleanPhone}` }
      ]
    });

    if (existingUser) {
      const errorMessage = existingUser.email === body.email
        ? 'Bu e-posta adresi zaten kullanımda'
        : 'Bu telefon numarası zaten kullanımda';
      
      logger.auth.registerAttempt(body.email, false, errorMessage);
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    // Şifre hash'leme
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt);

    // Yeni kullanıcı oluşturma
    const user = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: `+90${cleanPhone}`,
      passwordHash,
      lastSelectedRole: null,
      roles: [],
    });
    
    logger.auth.registerAttempt(body.email, true);
    logger.info('User registered successfully', { userId: user._id.toString() }, user._id.toString(), 'REGISTER_SUCCESS');

    // JWT token oluşturma
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      message: 'Kayıt başarılı',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });

    // API response logla
    const duration = Date.now() - startTime;
    logger.api.response('POST', '/api/register', 200, duration, user._id.toString());

    return response;
  } catch (error: any) {
    const duration = Date.now() - startTime;
    logger.api.error('POST', '/api/register', error);
    logger.api.response('POST', '/api/register', 500, duration);
    
    return NextResponse.json(
      { error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}