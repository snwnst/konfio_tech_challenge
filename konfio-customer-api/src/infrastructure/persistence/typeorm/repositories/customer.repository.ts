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
    return new Customer(
      customerEntity.id,
      customerEntity.name,
      customerEntity.email,
    );
  }

  async save(customer: Customer): Promise<void> {
    const customerEntity = new CustomerEntity();
    customerEntity.id = customer.id;
    customerEntity.name = customer.name;
    customerEntity.email = customer.email;
    await this.repository.save(customerEntity);
  }
}
