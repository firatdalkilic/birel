# Production deployment için PM2 config
module.exports = {
  apps: [
    {
      name: 'birel',
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
    }
  ]
};




