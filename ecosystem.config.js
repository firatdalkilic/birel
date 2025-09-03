# Production deployment için PM2 config
module.exports = {
  apps: [
    {
      name: 'birel-app',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/birelapp',
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
      // Logging
      log_file: '/var/log/birelapp/combined.log',
      out_file: '/var/log/birelapp/out.log',
      error_file: '/var/log/birelapp/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Restart policy
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      
      // Health check
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Kill timeout
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Environment variables
      env_file: '.env.production',
    },
  ],
  
  deploy: {
    production: {
      user: 'ubuntu',
      host: '185.99.199.83',
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/birel.git',
      path: '/var/www/birelapp',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
