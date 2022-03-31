import { checkEnv, dbEmailExist, verifyConnection } from "helper";
checkEnv();

import { corsOption } from "helper";
import { PORT, server, apolloServer } from "config";
import { DB_MAIN, DB_SELLER } from "db";

verifyConnection(DB_MAIN, "ECART_MAIN");
verifyConnection(DB_SELLER, "ECART_SELLER");

DB_MAIN.on("open", async () => {
  DB_SELLER.on("open", async () => {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app: server, cors: corsOption });

    server.listen(PORT, () => {
      console.log(
        `Server is listening on http://localhost:${PORT}${apolloServer.graphqlPath}`
      );
    });
  });
});
