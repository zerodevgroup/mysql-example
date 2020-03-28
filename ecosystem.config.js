module.exports = {
  apps : [{
    name: "mysql-example",
    script: "server.js",
    args: "",
    instances: 2,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G"
  }]
}
