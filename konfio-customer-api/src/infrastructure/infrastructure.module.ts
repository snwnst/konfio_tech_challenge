import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { PersistenceModule } from './persistence/persistence.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [ApiModule, PersistenceModule, EventsModule],
  exports: [ApiModule, PersistenceModule, EventsModule],
})
export class InfrastructureModule {}
