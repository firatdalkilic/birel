import { NextResponse } from 'next/server';
import crypto from 'crypto';

function verifySignature(secret: string, body: string, signature256: string | null) {
  if (!signature256) return false;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = `sha256=${hmac.update(body).digest('hex')}`;
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature256));
}

export async function POST(req: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET!;
  const sig = req.headers.get('x-hub-signature-256');

  const text = await req.text();
  const ok = verifySignature(secret, text, sig);

  if (!ok) {
    return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 });
  }

  // payload'a ihtiyacın varsa:
  // const payload = JSON.parse(text);

  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ message: 'GitHub webhook endpoint is active' }, { status: 200 });
}
