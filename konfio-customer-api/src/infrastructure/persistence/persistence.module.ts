import { Module } from '@nestjs/common';
import { ContactInfoRepository } from './typeorm/repositories/contact-info.repository';
import { CustomerRepository } from './typeorm/repositories/customer.repository';
import { PartyRepository } from './typeorm/repositories/party.repository';
import { TypeOrmPersistenceModule } from './typeorm/typeorm.module';

@Module({
  imports: [TypeOrmPersistenceModule],
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
