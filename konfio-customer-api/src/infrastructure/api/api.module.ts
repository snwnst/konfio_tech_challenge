import { Module } from '@nestjs/common';
import { RestModule } from './rest/rest.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [RestModule, CacheModule],
})
export class ApiModule {}
