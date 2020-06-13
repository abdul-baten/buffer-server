import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as httpContext from 'express-http-context';
import { configuration } from '@config';
import { createLogger, format, transports } from 'winston';
import { E_APP_ENVIRONMENT, E_CONTEXT } from '@enums';
import { Logger } from '@nestjs/common';
import appRoot = require('app-root-path');

const logDir = `${appRoot}/log`;
const { combine, colorize, align, timestamp, label, printf } = format;

export class LoggerUtil extends Logger {
  private static appEnvironment = configuration.default.APP.ENVIRONMENT;

  private static formatParams = printf(({ level, message }): string => {
    const context = httpContext.get(E_CONTEXT.REQUEST_LOGGING);
    const logID = context && context.correlationID ? context.correlationID : 'no-correlation-id-set';
    const timestamp = context && context.date ? context.date : new Date().toISOString();

    return `${timestamp} ${logID} ${level}: ${message}`;
  });

  private static consoleFormat = combine(
    colorize({ all: true }),
    timestamp(),
    label({ label: configuration.default.LOGGING.LABEL }),
    align(),
    LoggerUtil.formatParams,
  );

  private static fileFormat = combine(timestamp(), label({ label: configuration.default.LOGGING.LABEL }), align(), LoggerUtil.formatParams);

  private static errorLogDailyRotate = new DailyRotateFile({
    level: 'error',
    format: LoggerUtil.fileFormat,
    filename: `${logDir}/%DATE%-error.log`,
    datePattern: 'YYYY_MM_DD',
  });

  private static combinedLogDailyRotate = new DailyRotateFile({
    level: 'debug',
    format: LoggerUtil.fileFormat,
    filename: `${logDir}/%DATE%-combined.log`,
    datePattern: 'YYYY_MM_DD',
  });

  private static logger = createLogger({
    level: configuration.default.LOGGING.LEVEL,
    exitOnError: false,
    transports: [new transports.Console({ format: LoggerUtil.consoleFormat }), LoggerUtil.errorLogDailyRotate, LoggerUtil.combinedLogDailyRotate],
  });

  static logError(error: any) {
    if (LoggerUtil.appEnvironment === E_APP_ENVIRONMENT.DEVELOPMENT) {
      LoggerUtil.logger.error(`${error}`);
    }
  }

  static logInfo(info: string) {
    if (LoggerUtil.appEnvironment === E_APP_ENVIRONMENT.DEVELOPMENT) {
      LoggerUtil.logger.info(info);
    }
  }

  static logWarning(info: string) {
    if (LoggerUtil.appEnvironment === E_APP_ENVIRONMENT.DEVELOPMENT) {
      LoggerUtil.logger.warn(info);
    }
  }
}
