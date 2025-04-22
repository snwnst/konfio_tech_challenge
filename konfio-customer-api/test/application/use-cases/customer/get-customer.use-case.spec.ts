import { LoggerPort } from 'src/application/ports/logger.port';
import { GetCustomerUseCase } from 'src/application/use-cases/customer/get-customer.use-case';
import { CachePort } from 'src/domain/ports/cache.port';
import { mockCustomerRepository } from 'test/mocks/customer.repository.mock';

describe('GetCustomerUseCase', () => {
  let useCase: GetCustomerUseCase;
  let logger: jest.Mocked<LoggerPort>;

  beforeEach(() => {
    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as unknown as jest.Mocked<LoggerPort>;

    const cachePort = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      reset: jest.fn(),
    } as jest.Mocked<CachePort>;

    useCase = new GetCustomerUseCase(mockCustomerRepository, logger, cachePort);
  });

  it('should return a customer by ID', async () => {
    const customer = await useCase.execute('1');
    expect(customer).toBeDefined();
    expect(customer.id).toBe('1');
    expect(mockCustomerRepository.findById).toHaveBeenCalledWith('1');
  });
});
