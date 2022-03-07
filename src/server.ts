import { connection } from "mongoose";

import { checkEnv } from "@helper/env";
checkEnv();

import { PORT } from "@config/env";
import { dbConnect } from "@config/db";
import { server, apolloServer } from "@config/server";

dbConnect();
connection.on("open", async () => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app: server });

  server.listen(PORT, () => {
    console.log(
      `Server is listening on http://localhost:${PORT}${apolloServer.graphqlPath}`
    );
  });
});
