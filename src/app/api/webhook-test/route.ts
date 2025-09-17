import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook test endpoint is working',
    timestamp: new Date().toISOString(),
    status: 'ok',
    url: 'https://birelapp.com/webhooks/birel-deploy'
  }, { status: 200 });
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Webhook test POST is working',
    timestamp: new Date().toISOString(),
    status: 'ok'
  }, { status: 200 });
}
