import { Pact } from '@pact-foundation/pact';
import { Customer } from '../../src/domain/model/customer.model';
import axios from 'axios';

const provider = new Pact({
  consumer: 'CustomerConsumer',
  provider: 'CustomerProvider',
  port: 1234,
  log: process.cwd() + '/logs/pact.log',
  dir: process.cwd() + '/pacts',
  logLevel: 'info',
});

describe('Contract Testing for Customer API', () => {
  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());
  afterEach(() => provider.verify());

  it('should return a customer by ID', async () => {
    const expectedCustomer = {
      id: '1',
      name: 'Test Customer',
      taxId: 'TAX123',
      type: 'INDIVIDUAL',
      contactInfo: {
        id: '1',
        email: 'test@example.com',
        phone: '1234567890',
        address: '123 Test St',
      },
      parties: [],
      createdAt: '2025-04-22T18:11:30.223Z',
    };

    await provider.addInteraction({
      state: 'Customer with ID 1 exists',
      uponReceiving: 'a request for customer with ID 1',
      withRequest: {
        method: 'GET',
        path: '/customers/1',
        headers: { Accept: 'application/json' },
      },
      willRespondWith: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: expectedCustomer,
      },
    });

    const response = await axios.get('http://localhost:1234/customers/1', {
      headers: { Accept: 'application/json' },
    });

    expect(response.status).toBe(200);
    expect(response.data as Customer).toEqual(expectedCustomer);
  });
});
