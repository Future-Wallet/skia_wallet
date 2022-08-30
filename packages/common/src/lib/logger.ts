import { createLogger, format, transports } from 'winston';

interface LogMessage {
  message: string;
}

type Logger = {
  debug(logMessage: LogMessage): void;
  debug(message: string): void;
  info(logMessage: LogMessage): void;
  info(message: string): void;
};

/**
 * The logger prints the information on the console.
 *
 * It only works when it's not in production (`process.env.ENV` isn't `production`).
 *
 */
export const logger: Logger = {
  debug(data): void {
    if (
      process.env['NODE_ENV'] !== 'production' &&
      process.env['NX_ENABLE_LOGGER'] == 'true'
    ) {
      const logger = createLogger({
        level: 'debug',
        format: format.combine(
          format.timestamp(),
          format.printf(({ level, message, timestamp }) => {
            return `${level} ${timestamp}: ${message}`;
          })
        ),
        transports: new transports.Console(),
      });

      logger.debug({ message: typeof data == 'string' ? data : data.message });
    }
  },
  info(data): void {
    if (process.env['NODE_ENV'] !== 'production') {
      const logger = createLogger({
        level: 'info',
        format: format.combine(
          format.timestamp(),
          format.printf(({ level, message, timestamp }) => {
            return `${level} ${timestamp}: ${message}`;
          })
        ),
        transports: new transports.Console(),
      });

      logger.info({ message: typeof data == 'string' ? data : data.message });
    }
  },
};
