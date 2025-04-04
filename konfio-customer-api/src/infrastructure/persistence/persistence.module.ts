import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './typeorm/entities/customer.entity';
import { PartyEntity } from './typeorm/entities/party.entity';
import { ContactInfoEntity } from './typeorm/entities/contact-info.entity';
import { CustomerRepository } from './typeorm/repositories/customer.repository';
import { PartyRepository } from './typeorm/repositories/party.repository';
import { ContactInfoRepository } from './typeorm/repositories/contact-info.repository';
import { TypeOrmPersistenceModule } from './typeorm/typeorm.module';

@Module({
  imports: [
    TypeOrmPersistenceModule,
    TypeOrmModule.forFeature([CustomerEntity, PartyEntity, ContactInfoEntity]),
  ],
  providers: [
    {
      provide: 'CustomerRepositoryPort',
      useClass: CustomerRepository,
    },
    {
      provide: 'PartyRepositoryPort',
      useClass: PartyRepository,
    },
    {
      provide: 'ContactInfoRepositoryPort',
      useClass: ContactInfoRepository,
    },
  ],
  exports: [
    'CustomerRepositoryPort',
    'PartyRepositoryPort',
    'ContactInfoRepositoryPort',
  ],
})
export class PersistenceModule {}
