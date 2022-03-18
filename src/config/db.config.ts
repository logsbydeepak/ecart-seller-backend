import { connection, connect } from "mongoose";

import { DB_URL } from "config";

export const dbConnect = (): void => {
  connect(DB_URL as string);

  connection.on("open", () => {
    console.log("DB connection established successfully");
  });

  connection.on("error", () => {
    /* eslint no-console: ["error", { allow: ["log"] }] */
    console.log("Error establishing DB connection");
    process.exit(1);
  });
};

export const dbDrop = async (): Promise<void> => {
  await connection.dropDatabase();
  await connection.close();
};
