const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();
app.set('trust proxy', true);
const PORT = process.env.WEBHOOK_PORT || 3200;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // IP başına maksimum 100 istek
  message: {
    error: 'Too many requests from this IP',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Raw body middleware for HMAC verification
function rawBody(req, res, next) {
  let data = [];
  req.on('data', chunk => data.push(chunk));
  req.on('end', () => {
    req.rawBody = Buffer.concat(data);
    try { 
      req.body = JSON.parse(req.rawBody.toString() || '{}'); 
    } catch { 
      req.body = {}; 
    }
    next();
  });
}

// Webhook endpoint with raw body middleware
app.post('/webhooks/birel-deploy', rawBody, (req, res) => {
  const event = req.get('X-GitHub-Event') || '';
  
  // Log request
  console.log(`[${new Date().toISOString()}] Webhook received: ${event}`);
  
  // Handle ping event (test için)
  if (event === 'ping') {
    console.log('[WEBHOOK] ping ok:', req.body);
    return res.status(200).json({ ok: true, event: 'ping' });
  }

  // HMAC verification
  const signature = req.get('X-Hub-Signature-256') || '';
  const computed = 'sha256=' + crypto.createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(req.rawBody || '')
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computed))) {
    console.error('[WEBHOOK] signature mismatch');
    return res.status(401).json({ ok: false, error: 'invalid signature' });
  }

  // Handle non-push events (bilgi için logla, fail verme)
  if (event !== 'push') {
    console.log('[WEBHOOK] ignored event:', event);
    return res.status(200).json({ ok: true, event });
  }

  // Sadece main branch'i kabul et
  if (req.body.ref !== 'refs/heads/main') {
    console.log(`[WEBHOOK] Ignoring branch: ${req.body.ref}`);
    return res.status(200).json({ ok: true, message: 'Branch ignored' });
  }
  
  // Deploy script'ini çalıştır
  const deployScript = path.join('/var/www/birel', 'deploy.sh');
  const commitHash = req.body.head_commit?.id?.substring(0, 7) || 'unknown';
  const pusher = req.body.pusher?.name || 'unknown';
  
  console.log(`[${new Date().toISOString()}] Starting deployment for commit: ${commitHash} by ${pusher}`);
  
  exec(`sudo -u deploy ${deployScript} "${req.body.ref}" "${req.body.repository.name}" "${pusher}"`, {
    cwd: '/var/www/birel'
  }, (error, stdout, stderr) => {
    if (error) {
      console.error(`[WEBHOOK] Deployment failed: ${error.message}`);
      return res.status(500).json({ 
        ok: false,
        error: 'Deployment failed',
        details: error.message 
      });
    }
    
    console.log(`[${new Date().toISOString()}] Deployment completed successfully`);
    console.log('[WEBHOOK] STDOUT:', stdout);
    if (stderr) console.log('[WEBHOOK] STDERR:', stderr);
    
    res.status(200).json({ 
      ok: true,
      started: true,
      message: 'Deployment triggered successfully',
      commit: commitHash,
      pusher: pusher
    });
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'birel-webhook',
    time: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Bir El Webhook Server',
    version: '1.0.0',
    endpoints: {
      webhook: '/webhooks/birel-deploy',
      health: '/health'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Webhook server started on port ${PORT}`);
  console.log(`[${new Date().toISOString()}] Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
