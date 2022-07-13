import { PORT } from "~/config/env.config";
import checkEnv from "~/helper/env.helper";
import logger from "~/config/logger.config";
import startServer from "~/config/server.config";
import { connectToRedis } from "~/config/redis.config";
import { connectToDBuyer, connectToDBSeller } from "~/db/connection.db";

const startAllService = async () => {
  try {
    checkEnv();

    await connectToDBuyer();
    logger.info("DB Buyer connected successfully");

    await connectToDBSeller();
    logger.info("DB Seller connected successfully");

    await connectToRedis();
    logger.info("Redis connected successfully");

    await startServer();
    logger.info(`Server is listening on http://localhost:${PORT}/graphql`);
  } catch (error: any) {
    console.log(error);
  }
};

startAllService();
