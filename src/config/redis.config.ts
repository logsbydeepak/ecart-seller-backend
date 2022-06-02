import { createClient } from "redis";
import { REDIS_URL } from "~/config/env.config";

export const redisClient = createClient({ url: REDIS_URL });

export const connectToRedis = async () => {
  redisClient.on("error", () => {
    console.log("Redis Client Error");
    process.exit(1);
  });

  await redisClient.connect();
};
