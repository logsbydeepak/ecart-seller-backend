import checkEnv from "~/helper/env.helper";
checkEnv();

import logger from "~/config/logger.config";
import verifyConnection from "~/db/connection.db";
import { DB_MAIN, DB_SELLER } from "~/db/model.db";
import { ALLOW_ORIGIN, PORT } from "~/config/env.config";
import { apolloServer, server } from "~/config/server.config";

verifyConnection(DB_MAIN, "ECART_MAIN");
verifyConnection(DB_SELLER, "ECART_SELLER");

DB_MAIN.on("open", async () => {
  DB_SELLER.on("open", async () => {
    await apolloServer.start();
    apolloServer.applyMiddleware({
      app: server,
      cors: {
        origin: ALLOW_ORIGIN,
        credentials: true,
      },
    });

    server.listen(PORT, () => {
      logger.info(
        `Server is listening on http://localhost:${PORT}${apolloServer.graphqlPath}`
      );
    });
  });
});
