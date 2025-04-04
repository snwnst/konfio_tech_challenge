import { Customer } from '../model/customer.model';

export interface CustomerRepositoryPort {
  findAll(filters: {
    enterpriseType?: string;
    page?: number;
    limit?: number;
  }): Promise<{ customers: Customer[]; total: number }>;
  findById(id: string): Promise<Customer | null>;
  create(customer: Customer): Promise<Customer>;
  update(id: string, customer: Partial<Customer>): Promise<Customer>;
  delete(id: string): Promise<void>;
  addParty(customerId: string, partyId: string): Promise<void>;
  getParties(customerId: string): Promise<string[]>;
  updateParty(customerId: string, partyId: string, data: any): Promise<void>;
}
