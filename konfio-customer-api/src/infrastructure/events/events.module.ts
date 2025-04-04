import { Module } from '@nestjs/common';
import { KafkaAdapter } from './kafka/kafka.adapter';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: 'KafkaEventPort',
      useClass: KafkaAdapter,
    },
  ],
  exports: ['KafkaEventPort'],
})
export class EventsModule {}
