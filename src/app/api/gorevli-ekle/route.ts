import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Gorevli from '@/models/Gorevli';

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
      gorevTurleri,
      uygunSaat,
      referans,
      kvkkOnayi,
    } = body;

    if (!adSoyad || !telefon || !sehirIlce || !gorevTurleri || !uygunSaat || !kvkkOnayi) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik.' }, { status: 400 });
    }
    if (!kvkkOnayi) {
      return NextResponse.json({ error: 'KVKK onayı gereklidir.' }, { status: 400 });
    }

    // XSS koruması
    const gorevli = new Gorevli({
      adSoyad: sanitize(adSoyad),
      telefon: sanitize(telefon),
      sehirIlce: sanitize(sehirIlce),
      gorevTurleri: Array.isArray(gorevTurleri) ? gorevTurleri.map(sanitize) : [],
      uygunSaat: sanitize(uygunSaat),
      referans: sanitize(referans || ''),
      kvkkOnayi,
    });
    await gorevli.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
} 