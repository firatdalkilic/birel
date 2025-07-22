import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Gorevli from '@/models/Gorevli';

export async function POST(req: Request) {
  try {
    console.log('Login API çağrısı başladı');
    await dbConnect();
    
    const body = await req.json();
    console.log('Gelen veri:', { email: body.email });

    // Validasyon
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre zorunludur' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const user = await Gorevli.findOne({ email: body.email });
    if (!user) {
      console.log('Kullanıcı bulunamadı:', body.email);
      return NextResponse.json(
        { error: 'E-posta veya şifre hatalı. Lütfen tekrar deneyin.' },
        { status: 401 }
      );
    }

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(body.password, user.passwordHash);
    if (!isMatch) {
      console.log('Şifre eşleşmedi:', body.email);
      return NextResponse.json(
        { error: 'E-posta veya şifre hatalı. Lütfen tekrar deneyin.' },
        { status: 401 }
      );
    }

    // JWT token oluştur
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: body.rememberMe ? '30d' : '24h' }
    );

    // Response
    return NextResponse.json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Login API hatası:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
} 