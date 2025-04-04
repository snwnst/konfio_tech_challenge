import { Module } from '@nestjs/common';
import { WinstonLogger } from './winston.logger';

@Module({
  providers: [
    {
      provide: 'Logger',
      useClass: WinstonLogger,
    },
  ],
  exports: ['Logger'],
})
export class LoggerModule {}
