import { connection } from "mongoose";

import { checkEnv } from "helper";
checkEnv();

import { corsOption } from "helper";
import { PORT, dbConnect, server, apolloServer } from "config";

dbConnect();
connection.on("open", async () => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app: server, cors: corsOption });

  server.listen(PORT, () => {
    console.log(
      `Server is listening on http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
});
