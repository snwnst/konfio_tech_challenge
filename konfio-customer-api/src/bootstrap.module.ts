import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { LoggerModule } from './infrastructure/logger/logger.module';

@Module({
  imports: [InfrastructureModule, LoggerModule],
  controllers: [],
  providers: [],
})
export class BootstrapModule {}
