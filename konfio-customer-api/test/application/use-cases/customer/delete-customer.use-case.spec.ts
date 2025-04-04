import { DeleteCustomerUseCase } from '../../../../src/application/use-cases/customer/delete-customer.use-case';
import { CustomerRepositoryPort } from '../../../../src/domain/ports/customer.repository.port';
import { LoggerPort } from '../../../../src/application/ports/logger.port';
import { KafkaEventPort } from '../../../../src/domain/ports/kafka-event.port';
import { CachePort } from '../../../../src/domain/ports/cache.port';
import { Customer } from '../../../../src/domain/model/customer.model';
import { CustomerType } from '../../../../src/domain/model/customer-type.model';
import { NotFoundException } from '@nestjs/common';

describe('DeleteCustomerUseCase', () => {
  let useCase: DeleteCustomerUseCase;
  let customerRepository: jest.Mocked<CustomerRepositoryPort>;
  let logger: jest.Mocked<LoggerPort>;
  let kafkaEventPort: jest.Mocked<KafkaEventPort>;
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

    kafkaEventPort = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    } as jest.Mocked<KafkaEventPort>;

    cachePort = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      reset: jest.fn(),
    } as jest.Mocked<CachePort>;

    useCase = new DeleteCustomerUseCase(
      customerRepository,
      logger,
      kafkaEventPort,
      cachePort,
    );
  });

  describe('execute', () => {
    it('should delete customer successfully', async () => {
      customerRepository.findById.mockResolvedValue(mockCustomer);
      customerRepository.delete.mockResolvedValue();

      await useCase.execute('1');

      expect(customerRepository.findById).toHaveBeenCalledWith('1');
      expect(customerRepository.delete).toHaveBeenCalledWith('1');
      expect(cachePort.del).toHaveBeenCalledWith('customer:1');
      expect(kafkaEventPort.publish).toHaveBeenCalledWith('customer.deleted', {
        id: mockCustomer.id,
        taxId: mockCustomer.taxId,
        type: mockCustomer.type,
        name: mockCustomer.name,
        deletedAt: expect.any(String),
      });
      expect(logger.info).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException when customer does not exist', async () => {
      customerRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('1')).rejects.toThrow(NotFoundException);
      expect(logger.warn).toHaveBeenCalledWith(
        'Customer not found for deletion',
        {
          customerId: '1',
        },
      );
    });

    it('should handle errors when deleting customer', async () => {
      const error = new Error('Database error');
      customerRepository.findById.mockResolvedValue(mockCustomer);
      customerRepository.delete.mockRejectedValue(error);

      await expect(useCase.execute('1')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(
        'Error deleting customer',
        expect.objectContaining({
          error: error.message,
          customerId: '1',
        }),
      );
    });
  });
});
