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
    console.log('Görev veren kayıt API çağrısı başladı');
    await dbConnect();
    
    const body = await req.json();
    console.log('Gelen veri:', body);

    // Validasyon
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { error: 'Tüm zorunlu alanları doldurun' },
        { status: 400 }
      );
    }

    // E-posta kontrolü
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      console.log('E-posta zaten kullanımda:', body.email);
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Şifre hash'leme
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt);

    // Yeni görev veren oluşturma
    const user = await User.create({
      ...body,
      passwordHash,
      role: 'gorevveren',
    });
    console.log('Yeni görev veren oluşturuldu:', user._id);

    // JWT token oluşturma
    const token = jwt.sign(
      { userId: user._id, role: 'gorevveren' },
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
