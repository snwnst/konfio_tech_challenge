import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { RedisAdapter } from './redis/redis.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: 'redis',
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
        ttl: configService.get('REDIS_TTL', 3600),
        max: configService.get('REDIS_MAX_ITEMS', 100),
      }),
    }),
  ],
  providers: [
    {
      provide: 'CachePort',
      useClass: RedisAdapter,
    },
  ],
  exports: ['CachePort'],
})
export class CacheModule {}
