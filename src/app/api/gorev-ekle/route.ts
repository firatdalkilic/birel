import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Gorev from '@/models/Gorev';

function sanitize(input: string) {
  return input.replace(/[<>]/g, '');
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      adSoyad,
      telefon,
      sehirIlce,
      baslik,
      aciklama,
      aciliyet,
      butce,
      gizlilikOnayi,
    } = body;

    if (!adSoyad || !telefon || !sehirIlce || !aciliyet || !gizlilikOnayi) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik.' }, { status: 400 });
    }
    if (!gizlilikOnayi) {
      return NextResponse.json({ error: 'Gizlilik onayı gereklidir.' }, { status: 400 });
    }

    // XSS koruması
    const gorev = new Gorev({
      adSoyad: sanitize(adSoyad),
      telefon: sanitize(telefon),
      sehirIlce: sanitize(sehirIlce),
      baslik: sanitize(baslik || ''),
      aciklama: sanitize(aciklama || ''),
      aciliyet,
      butce: sanitize(butce || ''),
      gizlilikOnayi,
    });
    await gorev.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
} 