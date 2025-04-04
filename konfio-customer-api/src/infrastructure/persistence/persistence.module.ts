import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactInfoEntity } from './typeorm/entities/contact-info.entity';
import { CustomerEntity } from './typeorm/entities/customer.entity';
import { PartyEntity } from './typeorm/entities/party.entity';
import { ContactInfoRepository } from './typeorm/repositories/contact-info.repository';
import { CustomerRepository } from './typeorm/repositories/customer.repository';
import { PartyRepository } from './typeorm/repositories/party.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, ContactInfoEntity, PartyEntity]),
  ],
  providers: [
    {
      provide: 'CustomerRepositoryPort',
      useClass: CustomerRepository,
    },
    {
      provide: 'ContactInfoRepositoryPort',
      useClass: ContactInfoRepository,
    },
    {
      provide: 'PartyRepositoryPort',
      useClass: PartyRepository,
    },
  ],
  exports: [
    'CustomerRepositoryPort',
    'ContactInfoRepositoryPort',
    'PartyRepositoryPort',
  ],
})
export class PersistenceModule {}
