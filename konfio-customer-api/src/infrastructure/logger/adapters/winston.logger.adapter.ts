import { Injectable } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import { LoggerPort } from '../../../application/ports/logger.port';

@Injectable()
export class WinstonLoggerAdapter implements LoggerPort {
  private logger;

  constructor() {
    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        }),
        new transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new transports.File({
          filename: 'logs/combined.log',
        }),
      ],
    });
  }

  info(message: string, meta?: Record<string, any>): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.logger.info(message, meta);
  }

  error(message: string, meta?: Record<string, any>): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: Record<string, any>): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    this.logger.debug(message, meta);
  }
}
