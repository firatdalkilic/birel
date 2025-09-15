# Production deployment için PM2 config
module.exports = {
  apps: [
    {
      name: 'birel-web',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/birel',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/birel/error.log',
      out_file: '/var/log/birel/out.log',
      log_file: '/var/log/birel/combined.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'birel-webhook',
      script: 'webhook-server.js',
      cwd: '/var/www/birel',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        WEBHOOK_PORT: 3200,
        WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || 'your-webhook-secret'
      },
      error_file: '/var/log/birel/webhook-error.log',
      out_file: '/var/log/birel/webhook-out.log',
      log_file: '/var/log/birel/webhook-combined.log',
      time: true,
      max_memory_restart: '512M',
      restart_delay: 2000,
      max_restarts: 5,
      min_uptime: '5s'
    }
  ]
};




