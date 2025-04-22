import { CustomerRepositoryPort } from '../../src/domain/ports/customer.repository.port';
import { Customer } from '../../src/domain/model/customer.model';

export const mockCustomerRepository: jest.Mocked<CustomerRepositoryPort> = {
  findById: jest.fn().mockImplementation((id: string) => {
    if (id === '1') {
      return Promise.resolve({
        id: '1',
        name: 'Test Customer',
        taxId: 'TAX123',
        type: 'INDIVIDUAL',
        contactInfo: {
          email: 'test@example.com',
          phone: '1234567890',
          address: '123 Test St',
        },
        parties: [],
        createdAt: new Date(),
      } as unknown as Customer);
    }
    return Promise.resolve(null);
  }),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  addParty: jest.fn(),
  getParties: jest.fn(),
  updateParty: jest.fn(),
};
