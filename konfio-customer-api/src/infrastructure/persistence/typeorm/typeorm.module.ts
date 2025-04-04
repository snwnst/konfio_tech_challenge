import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { DatabaseConfigAdapter } from '../../config/database.config.adapter';
import { PartyEntity } from './entities/party.entity';
import { ContactInfoEntity } from './entities/contact-info.entity';

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
      migrationsTableName: configAdapter.getMigrationsTableName(),
      entities: [CustomerEntity, ContactInfoEntity, PartyEntity],
    }),
    TypeOrmModule.forFeature([CustomerEntity, ContactInfoEntity, PartyEntity]),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmPersistenceModule {}
