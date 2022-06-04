import checkEnv from "~/helper/env.helper";
checkEnv();

import verifyConnection from "~/db/connection.db";
import { DB_MAIN, DB_SELLER } from "~/db/model.db";
import startServer from "~/config/server.config";
import { connectToRedis } from "./config/redis.config";

verifyConnection(DB_MAIN, "ECART_MAIN");
verifyConnection(DB_SELLER, "ECART_SELLER");
connectToRedis();

DB_MAIN.on("open", async () => {
  DB_SELLER.on("open", async () => {
    startServer();
  });
});
