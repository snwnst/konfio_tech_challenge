import { Module } from '@nestjs/common';
import { WinstonLoggerAdapter } from './adapters/winston.logger.adapter';

@Module({
  providers: [
    {
      provide: 'LoggerPort',
      useClass: WinstonLoggerAdapter,
    },
  ],
  exports: ['LoggerPort'],
})
export class LoggerModule {}
