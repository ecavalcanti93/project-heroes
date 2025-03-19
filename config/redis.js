const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redis.on("connect", () => {
  console.log("✅ Conectado ao Redis");
});

redis.on("error", (err) => {
  console.error("❌ Erro no Redis:", err);
});

module.exports = redis;
