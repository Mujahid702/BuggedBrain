const { Redis } = require("@upstash/redis");
require("dotenv").config();

let redis = null;

if (process.env.REDIS_URL && process.env.REDIS_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.REDIS_URL,
      token: process.env.REDIS_TOKEN,
    });
    console.log("Redis initialized");
  } catch (err) {
    console.error("Redis initialization failed:", err.message);
  }
} else {
  console.log("Redis credentials not found, skipping caching.");
}

async function getCache(key) {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data;
  } catch (err) {
    console.error("Redis Get Error:", err.message);
    return null;
  }
}

async function setCache(key, value, ttlSeconds = 300) {
  if (!redis) return;
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch (err) {
    console.error("Redis Set Error:", err.message);
  }
}

async function clearCachePattern(pattern) {
  if (!redis) return;
  // Note: For advanced glob patterns, scan is needed. 
  // Upstash provides keys, but in production scan is better.
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      const pipeline = redis.pipeline();
      keys.forEach((k) => pipeline.del(k));
      await pipeline.exec();
    }
  } catch (err) {
    console.error("Redis Clear Error:", err.message);
  }
}

module.exports = { redis, getCache, setCache, clearCachePattern };
