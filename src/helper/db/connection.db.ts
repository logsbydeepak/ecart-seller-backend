import { Connection } from "mongoose";

export const verifyConnection = (DBConnection: Connection, DBName: string) => {
  DBConnection.on("open", () => {
    console.log(`[ ${DBName} ] DB connection established successfully`);
  });

  DBConnection.on("error", () => {
    console.log(`[ ${DBName} ] Error establishing DB connection`);
    process.exit(1);
  });
};
