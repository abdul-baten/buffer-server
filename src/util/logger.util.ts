import DailyRotateFile from 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports } from 'winston';
import { EAppEnvironment, EContext } from '@enums';
import { get } from 'express-http-context';
import { Injectable, Logger } from '@nestjs/common';

const { combine, colorize, align, timestamp, label, prettyPrint: pretty_print, printf } = format;

@Injectable()
export class LoggerUtilService extends Logger {
  constructor (private readonly configService: ConfigService) {
    super();
  }

  private appEnvironment (): string {
    return this.configService.get('APP.ENVIRONMENT') as string;
  }

  private logDir (): string {
    return this.configService.get('APP.LOG_DIR') as string;
  }

  private formatParams () {
    return printf(({ level, message }): string => {
      const context = get(EContext.REQUEST_LOGGING);
      const log_id = context && context.correlation_id ? context.correlation_id : 'no-correlation-id-set';
      const timestamp = context && context.date ? context.date : new Date().toISOString();

      return `${timestamp} ${log_id} ${level}: ${message}`;
    });
  }

  private consoleFormat () {
    return combine(
      align(),
      colorize({ all: true }),
      label({ label: this.configService.get('LOGGING.LABEL') }),
      pretty_print(),
      this.formatParams(),
      timestamp()
    );
  }

  private fileFormat () {
    return combine(pretty_print(), timestamp(), label({ label: this.configService.get('LOGGING.LABEL') }), align(), this.formatParams());
  }

  private errorLogDailyRotate () {
    return new DailyRotateFile({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      datePattern: 'YYYY_MM_DD',
      filename: `${this.logDir()}/%DATE%-error.log`,
      format: this.fileFormat(),
      json: true,
      level: 'error',
      utc: true
    });
  }

  private combinedLogDailyRotate () {
    return new DailyRotateFile({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      datePattern: 'YYYY_MM_DD',
      filename: `${this.logDir()}/%DATE%-combined.log`,
      format: this.fileFormat(),
      json: true,
      level: 'warn',
      utc: true
    });
  }

  private logger () {
    return createLogger({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      exitOnError: false,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      handleExceptions: false,
      level: this.configService.get('LOGGING.LABEL'),
      transports: [new transports.Console({ format: this.consoleFormat() }), this.errorLogDailyRotate(), this.combinedLogDailyRotate()]
    });
  }

  logError (error: unknown): void {
    if (this.appEnvironment() !== EAppEnvironment.PRODUCTION) {
      this.logger().error(`${error}`);
    }
  }

  logWarning (info: string): void {
    if (this.appEnvironment() !== EAppEnvironment.PRODUCTION) {
      this.logger().warn(info);
    }
  }
}
