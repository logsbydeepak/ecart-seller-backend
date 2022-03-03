import { dbConnect } from "./config/db.config";
import { connection } from "mongoose";
import { server, apolloServer } from "./config/server.config";
import { PORT } from "./config/env.config";

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
