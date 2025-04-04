import { CreateCustomerUseCase } from '../../../../src/application/use-cases/customer/create-customer.use-case';
import { CustomerRepositoryPort } from '../../../../src/domain/ports/customer.repository.port';
import { LoggerPort } from '../../../../src/application/ports/logger.port';
import { KafkaEventPort } from '../../../../src/domain/ports/kafka-event.port';
import { CachePort } from '../../../../src/domain/ports/cache.port';
import { Customer } from '../../../../src/domain/model/customer.model';
import { CustomerType } from '../../../../src/domain/model/customer-type.model';
import { CreateCustomerDto } from '../../../../src/infrastructure/api/rest/dtos/customer/create-customer.dto';

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
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

  const mockCreateCustomerDto: CreateCustomerDto = {
    name: 'Test Customer',
    taxId: 'TAX123',
    type: CustomerType.INDIVIDUAL,
    contactInfo: {
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test St',
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

    useCase = new CreateCustomerUseCase(
      customerRepository,
      logger,
      kafkaEventPort,
      cachePort,
    );
  });

  describe('execute', () => {
    it('should create a customer successfully', async () => {
      customerRepository.create.mockResolvedValue(mockCustomer);

      const result = await useCase.execute(mockCreateCustomerDto);

      expect(result).toEqual(mockCustomer);
      expect(customerRepository.create).toHaveBeenCalledWith(
        expect.objectContaining(mockCreateCustomerDto),
      );
      expect(cachePort.del).toHaveBeenCalledWith(`customer:${mockCustomer.id}`);
      expect(kafkaEventPort.publish).toHaveBeenCalledWith(
        'customer.created',
        mockCustomer,
      );
      expect(logger.info).toHaveBeenCalledTimes(2);
    });

    it('should handle errors when creating customer', async () => {
      const error = new Error('Database error');
      customerRepository.create.mockRejectedValue(error);

      await expect(useCase.execute(mockCreateCustomerDto)).rejects.toThrow(
        error,
      );
      expect(logger.error).toHaveBeenCalledWith(
        'Error creating customer',
        expect.objectContaining({
          error: error.message,
          data: mockCreateCustomerDto,
        }),
      );
    });

    it('should validate required fields', async () => {
      const invalidDto = {
        name: '',
        taxId: '',
        type: CustomerType.INDIVIDUAL,
        contactInfo: {
          email: 'invalid-email',
          phone: '',
          address: '',
        },
      } as CreateCustomerDto;

      await expect(useCase.execute(invalidDto)).rejects.toThrow();
    });
  });
});
