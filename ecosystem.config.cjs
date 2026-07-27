module.exports = {
  apps: [
    {
      name: "my-app",
      script: "./build/index.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        DATABASE_URL: "postgres://postgres:1234@localhost:5432/postgres",
        ORIGIN: "https://inv.tail3f51f2.ts.net/"
      }
    }
  ]
};