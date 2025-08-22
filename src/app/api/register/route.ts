import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
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
    console.log('Kayıt API çağrısı başladı');
    await dbConnect();
    
    const body = await req.json();
    console.log('Gelen veri:', { ...body, password: '[GİZLENDİ]' });

    // Validasyon
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { error: 'Tüm zorunlu alanları doldurun' },
        { status: 400 }
      );
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // Şifre uzunluğu kontrolü
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'Şifreniz en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Telefon numarası formatı kontrolü
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
    const cleanPhone = body.phone.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
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
      
      console.log(`${errorMessage}:`, existingUser.email === body.email ? body.email : body.phone);
      
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
    console.log('Yeni kullanıcı oluşturuldu:', user._id);

    // JWT token oluşturma
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Kayıt başarılı',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('API hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}