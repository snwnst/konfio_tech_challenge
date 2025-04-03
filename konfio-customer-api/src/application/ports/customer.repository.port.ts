import { Customer } from '../../domain/entities/customer.entity';

export interface CustomerRepositoryPort {
  findById(id: string): Promise<Customer>;
  save(customer: Customer): Promise<void>;
}
