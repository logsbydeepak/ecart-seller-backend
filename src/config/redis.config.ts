import { createClient } from "redis";
import { REDIS_URL } from "~/config/env.config";

export const redisClient = createClient({ url: REDIS_URL });

export const connectToRedis = () => redisClient.connect();
