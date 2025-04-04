import { Customer } from '../../domain/model/customer.model';

export interface CustomerRepositoryPort {
  save(customer: Customer): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
}
