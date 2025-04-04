import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../entities/customer.entity';
import { Customer } from '../../../../domain/model/customer.model';
import { CustomerRepositoryPort } from '../../../../application/ports/customer.repository.port';

@Injectable()
export class CustomerRepository implements CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {}

  async findById(id: string): Promise<Customer> {
    const customerEntity = await this.repository.findOne({ where: { id } });
    if (!customerEntity) {
      throw new Error('Customer not found');
    }
    return customerEntity.toDomain();
  }

  async save(customer: Customer): Promise<void> {
    const customerEntity = CustomerEntity.fromDomain(customer);
    await this.repository.save(customerEntity);
  }
}
