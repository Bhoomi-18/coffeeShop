module.exports = {
  apps: [{
    name: 'coffeeshop-backend',
    script: 'server.js',
    cwd: '/home/ubuntu/coffeeShop/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/ubuntu/logs/coffeeshop-err.log',
    out_file: '/home/ubuntu/logs/coffeeshop-out.log',
    log_file: '/home/ubuntu/logs/coffeeshop-combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s',
    exec_mode: 'fork',
    kill_timeout: 3000,
    listen_timeout: 3000,
    wait_ready: true
  }]
};
