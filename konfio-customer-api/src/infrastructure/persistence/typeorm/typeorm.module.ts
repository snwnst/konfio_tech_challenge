import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { DatabaseConfigAdapter } from '../../config/database.config.adapter';

const configAdapter = new DatabaseConfigAdapter();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: configAdapter.getHost(),
      port: configAdapter.getPort(),
      username: configAdapter.getUsername(),
      password: configAdapter.getPassword(),
      database: configAdapter.getDatabase(),
      migrations: configAdapter.getMigrations('typeOrm'),
      synchronize: configAdapter.shouldSynchronize(),
      logging: configAdapter.shouldLog(),
      entities: [CustomerEntity],
    }),
    TypeOrmModule.forFeature([CustomerEntity]),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmPersistenceModule {}
