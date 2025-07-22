import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import Gorevli from '@/models/Gorevli';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // E-posta kontrolü
    const existingUser = await Gorevli.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Şifre hash'leme
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt);

    // Yeni görevli oluşturma
    const gorevli = await Gorevli.create({
      ...body,
      passwordHash,
      role: 'gorevli',
    });

    // JWT token oluşturma
    const token = jwt.sign(
      { userId: gorevli._id, role: 'gorevli' },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Kayıt başarılı',
      token,
      user: {
        id: gorevli._id,
        firstName: gorevli.firstName,
        lastName: gorevli.lastName,
        email: gorevli.email,
      },
    });
  } catch (error: any) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json(
      { error: error.message || 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 