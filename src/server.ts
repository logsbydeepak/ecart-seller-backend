import { checkEnv, verifyConnection } from "helper";
checkEnv();

import { corsOption } from "helper";
import { PORT, server, apolloServer } from "config";
import { DB_MAIN, DB_SELLER } from "db";
import logger from "config/logger.config";

verifyConnection(DB_MAIN, "ECART_MAIN");
verifyConnection(DB_SELLER, "ECART_SELLER");

DB_MAIN.on("open", async () => {
  DB_SELLER.on("open", async () => {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app: server, cors: corsOption });

    server.listen(PORT, () => {
      logger.info(
        `Server is listening on http://localhost:${PORT}${apolloServer.graphqlPath}`
      );
    });
  });
});
