import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { PersistenceModule } from './persistence/persistence.module';

@Module({
  imports: [ApiModule, PersistenceModule],
  exports: [ApiModule, PersistenceModule],
})
export class InfrastructureModule {}
