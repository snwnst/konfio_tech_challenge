import { Customer } from '../../domain/model/customer.model';

export interface CustomerRepositoryPort {
  findById(id: string): Promise<Customer>;
  save(customer: Customer): Promise<void>;
}
