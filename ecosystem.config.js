module.exports = {
  apps: [
    {
      name: "birel",
      cwd: "/var/www/birel",
      script: ".next/standalone/server.js",
      args: "-p 3000",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      }
    }
  ]
};
