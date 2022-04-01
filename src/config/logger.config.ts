import "winston-mongodb";
import { Format } from "logform";
import { createLogger, transports, format, Logger } from "winston";

import { DB_URL_LOGGER, NODE_ENV } from "config";

const { combine, timestamp: formatTimeStamp, printf, colorize } = format;

const logger: Logger = createLogger({
  level: "info",
  transports: [
    new transports.MongoDB({
      db: DB_URL_LOGGER as string,
      collection: "logs",
      options: {
        useUnifiedTopology: true,
      },
    }),
  ],
});

if (NODE_ENV !== "test") {
  logger.add(
    new transports.MongoDB({
      db: DB_URL_LOGGER as string,
      collection: "logs",
      options: {
        useUnifiedTopology: true,
      },
    })
  );
}

const timeZone = (): string => new Date().toLocaleString();

const consoleFormat: Format = printf(
  ({ timestamp, level, message }) => `[${level}] [${timestamp}] ${message}`
);

if (NODE_ENV !== "prod") {
  logger.add(
    new transports.Console({
      format: combine(
        colorize(),
        formatTimeStamp({ format: timeZone }),
        consoleFormat
      ),
    })
  );
}

export default logger;
