module.exports = {
  apps: [
    {
      name: "birel-web",
      cwd: "/var/www/birel",
      script: ".next/standalone/server.js",
      exec_mode: "fork",
      instances: 1,
      env: { NODE_ENV: "production", PORT: "3000" }
    }
  ]
};
