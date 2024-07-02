import { createClient, RedisClientType } from "redis";
import CONFIG from "../config/config";
import logger from "../logger/logger";

const client: RedisClientType = createClient({
  password: CONFIG.REDIS_PASSWORD,
  socket: {
    host: CONFIG.REDIS_HOST,
    port: CONFIG.REDIS_PORT,
  },
});

client.on("connect", () => {
  logger.info("Redis client connected");
});

export default client;
