import { ListCustomersUseCase } from '../../../../src/application/use-cases/customer/list-customers.use-case';
import { CustomerRepositoryPort } from '../../../../src/domain/ports/customer.repository.port';
import { LoggerPort } from '../../../../src/application/ports/logger.port';
import { CachePort } from '../../../../src/domain/ports/cache.port';
import { Customer } from '../../../../src/domain/model/customer.model';
import { CustomerType } from '../../../../src/domain/model/customer-type.model';

describe('ListCustomersUseCase', () => {
  let useCase: ListCustomersUseCase;
  let customerRepository: jest.Mocked<CustomerRepositoryPort>;
  let logger: jest.Mocked<LoggerPort>;
  let cachePort: jest.Mocked<CachePort>;

  const mockCustomers = [
    new Customer(
      '1',
      'Test Customer 1',
      'TAX123',
      CustomerType.INDIVIDUAL,
      {
        id: '1',
        email: 'test1@example.com',
        phone: '1234567890',
        address: '123 Test St',
      },
      [],
      new Date(),
    ),
    new Customer(
      '2',
      'Test Customer 2',
      'TAX456',
      CustomerType.ENTERPRISE,
      {
        id: '2',
        email: 'test2@example.com',
        phone: '0987654321',
        address: '456 Test St',
      },
      [],
      new Date(),
    ),
  ];

  const mockFilters = {
    enterpriseType: 'ENTERPRISE',
    page: 1,
    limit: 10,
  };

  const mockResult = {
    customers: mockCustomers,
    total: 2,
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

    cachePort = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      reset: jest.fn(),
    } as jest.Mocked<CachePort>;

    useCase = new ListCustomersUseCase(customerRepository, logger, cachePort);
  });

  describe('execute', () => {
    it('should return customers from cache if available', async () => {
      cachePort.get.mockResolvedValue(mockResult);

      const result = await useCase.execute(mockFilters);

      expect(result).toEqual(mockResult);
      expect(cachePort.get).toHaveBeenCalledWith(
        `customers:list:${JSON.stringify(mockFilters)}`,
      );
      expect(customerRepository.findAll).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        'Customers retrieved from cache',
      );
    });

    it('should fetch customers from repository if not in cache', async () => {
      cachePort.get.mockResolvedValue(null);
      customerRepository.findAll.mockResolvedValue(mockResult);

      const result = await useCase.execute(mockFilters);

      expect(result).toEqual(mockResult);
      expect(cachePort.get).toHaveBeenCalledWith(
        `customers:list:${JSON.stringify(mockFilters)}`,
      );
      expect(customerRepository.findAll).toHaveBeenCalledWith(mockFilters);
      expect(cachePort.set).toHaveBeenCalledWith(
        `customers:list:${JSON.stringify(mockFilters)}`,
        mockResult,
      );
      expect(logger.info).toHaveBeenCalledWith(
        'Customers retrieved successfully',
        {
          total: mockResult.total,
          count: mockResult.customers.length,
        },
      );
    });

    it('should handle errors when listing customers', async () => {
      const error = new Error('Database error');
      cachePort.get.mockRejectedValue(error);

      await expect(useCase.execute(mockFilters)).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(
        'Error listing customers',
        expect.objectContaining({
          error: error.message,
          filters: mockFilters,
        }),
      );
    });

    it('should work with empty filters', async () => {
      const emptyFilters = {};
      cachePort.get.mockResolvedValue(null);
      customerRepository.findAll.mockResolvedValue(mockResult);

      const result = await useCase.execute(emptyFilters);

      expect(result).toEqual(mockResult);
      expect(cachePort.get).toHaveBeenCalledWith(
        `customers:list:${JSON.stringify(emptyFilters)}`,
      );
      expect(customerRepository.findAll).toHaveBeenCalledWith(emptyFilters);
    });
  });
});
