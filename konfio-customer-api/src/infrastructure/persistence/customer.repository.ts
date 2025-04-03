import { Injectable } from '@nestjs/common';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepositoryPort } from '../../application/ports/customer.repository.port';

@Injectable()
export class CustomerRepository implements CustomerRepositoryPort {
  async findById(id: string): Promise<Customer> {
    // Implementation will go here
    throw new Error('Method not implemented.');
  }

  async save(customer: Customer): Promise<void> {
    // Implementation will go here
    throw new Error('Method not implemented.');
  }
}
