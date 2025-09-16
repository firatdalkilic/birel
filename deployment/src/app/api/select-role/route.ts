import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();

    // Token'ı al ve doğrula
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Yetkilendirme başarısız' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;

    // Request body'den rolü al
    const body = await req.json();
    const { role } = body;

    if (!role || !['gorevli', 'gorevveren'].includes(role)) {
      return NextResponse.json(
        { error: 'Geçersiz rol' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul ve güncelle
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Rolü daha önce seçilmemişse roles array'ine ekle
    if (!user.roles.includes(role)) {
      user.roles.push(role);
    }

    // Son seçilen rolü güncelle
    user.lastSelectedRole = role;
    await user.save();

    return NextResponse.json({
      message: 'Rol başarıyla güncellendi',
      role,
    });
  } catch (error: any) {
    console.error('Rol seçim hatası:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 