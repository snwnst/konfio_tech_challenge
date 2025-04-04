import { UpdateCustomerUseCase } from '../../../../src/application/use-cases/customer/update-customer.use-case';
import { CustomerRepositoryPort } from '../../../../src/domain/ports/customer.repository.port';
import { LoggerPort } from '../../../../src/application/ports/logger.port';
import { KafkaEventPort } from '../../../../src/domain/ports/kafka-event.port';
import { CachePort } from '../../../../src/domain/ports/cache.port';
import { Customer } from '../../../../src/domain/model/customer.model';
import { CustomerType } from '../../../../src/domain/model/customer-type.model';
import { UpdateCustomerDto } from '../../../../src/infrastructure/api/rest/dtos/customer/update-customer.dto';
import { NotFoundException } from '@nestjs/common';

describe('UpdateCustomerUseCase', () => {
  let useCase: UpdateCustomerUseCase;
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

  const mockUpdateCustomerDto: UpdateCustomerDto = {
    name: 'Updated Customer',
    taxId: 'TAX456',
    type: CustomerType.ENTERPRISE,
    contactInfo: {
      id: '1',
      email: 'updated@example.com',
      phone: '9876543210',
      address: '456 Updated St',
    },
  };

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

    useCase = new UpdateCustomerUseCase(
      customerRepository,
      logger,
      kafkaEventPort,
      cachePort,
    );
  });

  describe('execute', () => {
    it('should update customer successfully', async () => {
      const updatedCustomer = new Customer(
        '1',
        mockUpdateCustomerDto.name!,
        mockUpdateCustomerDto.taxId!,
        mockUpdateCustomerDto.type!,
        mockUpdateCustomerDto.contactInfo,
        [],
        new Date(),
      );

      customerRepository.findById.mockResolvedValue(mockCustomer);
      customerRepository.update.mockResolvedValue(updatedCustomer);

      const result = await useCase.execute('1', mockUpdateCustomerDto);

      expect(result).toEqual(updatedCustomer);
      expect(customerRepository.findById).toHaveBeenCalledWith('1');
      expect(customerRepository.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining(mockUpdateCustomerDto),
      );
      expect(cachePort.del).toHaveBeenCalledWith('customer:1');
      expect(kafkaEventPort.publish).toHaveBeenCalledWith(
        'customer.updated',
        updatedCustomer,
      );
      expect(logger.info).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException when customer does not exist', async () => {
      customerRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('1', mockUpdateCustomerDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(logger.warn).toHaveBeenCalledWith(
        'Customer not found for update',
        {
          customerId: '1',
        },
      );
    });

    it('should handle errors when updating customer', async () => {
      const error = new Error('Database error');
      customerRepository.findById.mockResolvedValue(mockCustomer);
      customerRepository.update.mockRejectedValue(error);

      await expect(useCase.execute('1', mockUpdateCustomerDto)).rejects.toThrow(
        error,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error updating customer',
        expect.objectContaining({
          error: error.message,
          customerId: '1',
          data: mockUpdateCustomerDto,
        }),
      );
    });
  });
});
