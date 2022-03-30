import { checkEnv, DB_MAIN, DB_SELLER } from "helper";
checkEnv();

import { corsOption } from "helper";
import { PORT, server, apolloServer } from "config";

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
