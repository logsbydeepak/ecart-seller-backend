import logger from "~/config/logger.config";
import { Connection } from "mongoose";

const verifyConnection = (DBConnection: Connection, DBName: string) => {
  DBConnection.on("open", () => {
    logger.info(`${DBName} | DB connection established successfully`);
  });

  DBConnection.on("error", () => {
    logger.info(`
    ${DBName} Error establishing DB connection`);
    process.exit(1);
  });
};

export default verifyConnection;
