import { Customer } from '../model/customer.model';

export interface CustomerRepositoryPort {
  findById(id: string): Promise<Customer | null>;
  findAll(filters?: any): Promise<{ customers: Customer[]; total: number }>;
  create(customer: Customer): Promise<Customer>;
  update(id: string, customer: Customer): Promise<Customer>;
  delete(id: string): Promise<void>;
}
