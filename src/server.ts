import checkEnv from "~/helper/env.helper";
checkEnv();

import startServer from "~/config/server.config";
import { connectToRedis } from "./config/redis.config";
import { connectToDBuyer, connectToDBSeller } from "./db/connection.db";
import logger from "./config/logger.config";

const startAllService = async () => {
  try {
    await connectToDBuyer();
    logger.info("DBBuyer connected successfully");

    await connectToDBSeller();
    logger.info("DBSeller connected successfully");

    await connectToRedis();
    logger.info("Redis connected successfully");

    startServer();
  } catch (error: any) {
    console.log(error);
    process.exit(1);
  }
};

startAllService();
