import { Module } from '@nestjs/common';
import { CustomerRepository } from './typeorm/repositories/customer.repository';
import { TypeOrmPersistenceModule } from './typeorm/typeorm.module';

@Module({
  imports: [TypeOrmPersistenceModule],
  providers: [
    {
      provide: 'CustomerRepositoryPort',
      useClass: CustomerRepository,
    },
  ],
  exports: ['CustomerRepositoryPort'],
})
export class PersistenceModule {}
