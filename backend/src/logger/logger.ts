import { createLogger, format, transports, Logger } from "winston";

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const devLogger = (): Logger => {
  return createLogger({
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    transports: [new transports.Console()],
  });
};

const prodLogger = (): Logger => {
  return createLogger({
    level: "info",
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
      new transports.Console({
        level: 'info',
      }),
      // Uncomment the following lines if you want to log to files
      // new transports.File({
      //   filename: 'logs/error.log',
      //   level: 'error',
      // }),
      // new transports.File({ filename: 'logs/combined.log' }),
    ],
  });
};

let logger: Logger;

if (process.env.NODE_ENV !== 'production') {
  logger = devLogger();
} else {
  logger = prodLogger();
}

export default logger;
