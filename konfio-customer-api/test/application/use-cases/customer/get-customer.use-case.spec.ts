import { GetCustomerUseCase } from '../../../../src/application/use-cases/customer/get-customer.use-case';
import { CustomerRepositoryPort } from '../../../../src/domain/ports/customer.repository.port';
import { LoggerPort } from '../../../../src/application/ports/logger.port';
import { CachePort } from '../../../../src/domain/ports/cache.port';
import { Customer } from '../../../../src/domain/model/customer.model';
import { CustomerType } from '../../../../src/domain/model/customer-type.model';
import { NotFoundException } from '@nestjs/common';

describe('GetCustomerUseCase', () => {
  let useCase: GetCustomerUseCase;
  let customerRepository: jest.Mocked<CustomerRepositoryPort>;
  let logger: jest.Mocked<LoggerPort>;
  let cachePort: jest.Mocked<CachePort>;

  const mockCustomer = new Customer(
    '1',
    'Test Customer',
    'TAX123',
    CustomerType.INDIVIDUAL,
    {
      id: '1',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test St',
    },
    [],
    new Date(),
  );

  beforeEach(() => {
    customerRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addParty: jest.fn(),
      getParties: jest.fn(),
      updateParty: jest.fn(),
    } as jest.Mocked<CustomerRepositoryPort>;

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as jest.Mocked<LoggerPort>;

    cachePort = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      reset: jest.fn(),
    } as jest.Mocked<CachePort>;

    useCase = new GetCustomerUseCase(customerRepository, logger, cachePort);
  });

  describe('execute', () => {
    it('should return customer from cache if available', async () => {
      cachePort.get.mockResolvedValue(mockCustomer);

      const result = await useCase.execute('1');

      expect(result).toEqual(mockCustomer);
      expect(cachePort.get).toHaveBeenCalledWith('customer:1');
      expect(customerRepository.findById).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        'Customer retrieved from cache',
        { customerId: '1' },
      );
    });

    it('should fetch customer from repository if not in cache', async () => {
      cachePort.get.mockResolvedValue(null);
      customerRepository.findById.mockResolvedValue(mockCustomer);

      const result = await useCase.execute('1');

      expect(result).toEqual(mockCustomer);
      expect(cachePort.get).toHaveBeenCalledWith('customer:1');
      expect(customerRepository.findById).toHaveBeenCalledWith('1');
      expect(cachePort.set).toHaveBeenCalledWith('customer:1', mockCustomer);
      expect(logger.info).toHaveBeenCalledWith(
        'Customer retrieved successfully',
        {
          customerId: mockCustomer.id,
          taxId: mockCustomer.taxId,
          type: mockCustomer.type,
        },
      );
    });

    it('should throw NotFoundException when customer is not found', async () => {
      cachePort.get.mockResolvedValue(null);
      customerRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('1')).rejects.toThrow(NotFoundException);
      expect(logger.warn).toHaveBeenCalledWith('Customer not found', {
        customerId: '1',
      });
    });

    it('should handle errors when getting customer', async () => {
      const error = new Error('Database error');
      cachePort.get.mockRejectedValue(error);

      await expect(useCase.execute('1')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(
        'Error getting customer',
        expect.objectContaining({
          error: error.message,
          customerId: '1',
        }),
      );
    });
  });
});
