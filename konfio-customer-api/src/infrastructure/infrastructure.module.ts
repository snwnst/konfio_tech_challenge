import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { PersistenceModule } from './persistence/persistence.module';
import { EventsModule } from './events/events.module';
import { CacheModule } from './cache/cache.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ApiModule,
    PersistenceModule,
    EventsModule,
    CacheModule,
    LoggerModule,
  ],
  exports: [
    ApiModule,
    PersistenceModule,
    EventsModule,
    CacheModule,
    LoggerModule,
  ],
})
export class InfrastructureModule {}
