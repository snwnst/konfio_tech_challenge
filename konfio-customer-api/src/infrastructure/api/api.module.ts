import { Module } from '@nestjs/common';
import { HealthController } from './rest/health.controller';

@Module({
  imports: [],
  exports: [],
  controllers: [HealthController],
})
export class ApiModule {}
