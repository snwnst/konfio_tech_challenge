import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './typeorm/typeorm.config';
import { CustomerRepository } from './typeorm/repositories/customer.repository';
import { CustomerEntity } from './typeorm/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([CustomerEntity]),
  ],
  providers: [
    {
      provide: 'CustomerRepositoryPort',
      useClass: CustomerRepository,
    },
  ],
  exports: ['CustomerRepositoryPort'],
})
export class PersistenceModule {}
