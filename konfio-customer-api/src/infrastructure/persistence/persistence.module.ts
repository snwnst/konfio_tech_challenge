import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from './typeorm/repositories/customer.repository';
import { CustomerEntity } from './typeorm/entities/customer.entity';
import { DatabaseConfigAdapter } from '../config/database.config.adapter';
import { DatabaseConfigPort } from '../../application/ports/database.config.port';
import { DATABASE_CONFIG_PORT } from '../../application/ports/injection.tokens';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PersistenceModule],
      useFactory: (configAdapter: DatabaseConfigPort) => ({
        type: 'mysql',
        host: configAdapter.getHost(),
        port: configAdapter.getPort(),
        username: configAdapter.getUsername(),
        password: configAdapter.getPassword(),
        database: configAdapter.getDatabase(),
        entities: configAdapter.getEntities(),
        migrations: configAdapter.getMigrations(),
        synchronize: configAdapter.shouldSynchronize(),
        logging: configAdapter.shouldLog(),
        cli: {
          migrationsDir: configAdapter.getMigrations()[0],
        },
      }),
      inject: [DATABASE_CONFIG_PORT],
    }),
    TypeOrmModule.forFeature([CustomerEntity]),
  ],
  providers: [
    {
      provide: 'CustomerRepositoryPort',
      useClass: CustomerRepository,
    },
    {
      provide: DATABASE_CONFIG_PORT,
      useClass: DatabaseConfigAdapter,
    },
  ],
  exports: ['CustomerRepositoryPort', DATABASE_CONFIG_PORT],
})
export class PersistenceModule {}
