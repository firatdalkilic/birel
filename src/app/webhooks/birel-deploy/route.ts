import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

function verifySignature(secret: string, body: string, signature256: string | null) {
  if (!signature256) return false;
  const hmac = crypto.createHmac('sha256', secret);
  const digest = `sha256=${hmac.update(body).digest('hex')}`;
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature256));
}

export async function POST(req: Request) {
  console.log('Webhook POST received');
  
  // Rate limiting bypass for webhooks
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', 'unlimited');
  headers.set('X-RateLimit-Remaining', 'unlimited');
  
  try {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      console.error('GITHUB_WEBHOOK_SECRET not set');
      return NextResponse.json({ ok: false, error: 'Secret not configured' }, { status: 500 });
    }

    const sig = req.headers.get('x-hub-signature-256');
    const event = req.headers.get('x-github-event');
    console.log('Signature header:', sig ? 'present' : 'missing');
    console.log('GitHub event:', event);

    const text = await req.text();
    const ok = verifySignature(secret, text, sig);

    if (!ok) {
      console.error('Invalid signature');
      return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 });
    }

    // Handle ping event
    if (event === 'ping') {
      console.log('Webhook ping received');
      return NextResponse.json({ ok: true, event: 'ping' }, { status: 200 });
    }

    // Handle push event
    if (event === 'push') {
      console.log('Webhook push received - starting deployment');
      
      try {
        // Run deployment script
        const { stdout, stderr } = await execAsync('bash /var/www/birelapp/deploy.sh');
        console.log('Deployment output:', stdout);
        if (stderr) console.error('Deployment error:', stderr);
        
        return NextResponse.json({ 
          ok: true, 
          message: 'Deployment started',
          output: stdout 
        }, { status: 200 });
      } catch (error) {
        console.error('Deployment failed:', error);
        return NextResponse.json({ 
          ok: false, 
          error: 'Deployment failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    console.log('Webhook verified successfully');
    return NextResponse.json({ ok: true, message: 'Webhook processed' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  console.log('Webhook GET received');
  return NextResponse.json({ 
    message: 'GitHub webhook endpoint is active',
    timestamp: new Date().toISOString(),
    status: 'ok'
  }, { status: 200 });
}
