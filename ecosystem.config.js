# Production deployment için PM2 config
module.exports = {
  apps: [
    {
      name: 'birel-web',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/birel/current',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      
      // Logging configuration
      log_file: '/home/deploy/logs/birel-web-combined.log',
      out_file: '/home/deploy/logs/birel-web-out.log',
      error_file: '/home/deploy/logs/birel-web-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Restart policy
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Health check
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Kill timeout
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Environment variables
      env_file: '.env.production',
      
      // Node.js options
      node_args: '--max-old-space-size=1024',
      
      // Process management
      pid_file: '/var/run/birel-web.pid',
      
      // Monitoring
      pmx: true,
      
      // Metrics
      merge_logs: true,
      
      // Error handling
      ignore_watch: ['node_modules', 'logs', '.git'],
      
      // Cron restart (optional - daily at 3 AM)
      cron_restart: '0 3 * * *',
    },
    {
      name: 'birel-webhook',
      script: 'webhook-server.js',
      cwd: '/opt/birel-webhook',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        WEBHOOK_PORT: 3200,
      },
      env_production: {
        NODE_ENV: 'production',
        WEBHOOK_PORT: 3200,
      },
      
      // Logging configuration
      log_file: '/home/deploy/logs/birel-webhook-combined.log',
      out_file: '/home/deploy/logs/birel-webhook-out.log',
      error_file: '/home/deploy/logs/birel-webhook-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Restart policy
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Kill timeout
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Environment variables
      env_file: '.env',
      
      // Process management
      pid_file: '/var/run/birel-webhook.pid',
      
      // Monitoring
      pmx: true,
      
      // Metrics
      merge_logs: true,
      
      // Error handling
      ignore_watch: ['node_modules', 'logs'],
    },
  ],
  
  deploy: {
    production: {
      user: 'deploy',
      host: '185.99.199.83',
      ref: 'origin/main',
      repo: 'git@github.com:firatdalkilic/birel.git',
      path: '/var/www/birel',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
  
  // PM2 configuration
  pm2: {
    // Global PM2 settings
    max_memory_restart: '1G',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Monitoring
    pmx: true,
    
    // Logs
    merge_logs: true,
    
    // Error handling
    ignore_watch: ['node_modules', 'logs', '.git'],
  },
};
