import { Injectable, Inject } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Customer } from '../../../domain/model/customer.model';
import { Logger } from '../../../infrastructure/logger/logger.interface';
import { CachePort } from '../../../domain/ports/cache.port';

@Injectable()
export class ListCustomersUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject('Logger')
    private readonly logger: Logger,
    @Inject('CachePort')
    private readonly cachePort: CachePort,
  ) {}

  async execute(filters: {
    enterpriseType?: string;
    page?: number;
    limit?: number;
  }): Promise<{ customers: Customer[]; total: number }> {
    try {
      this.logger.info('Listing customers with filters', { filters });

      // Generate a cache key based on filters
      const cacheKey = `customers:list:${JSON.stringify(filters)}`;

      // Try to get from cache first
      const cachedResult = await this.cachePort.get<{
        customers: Customer[];
        total: number;
      }>(cacheKey);

      if (cachedResult) {
        this.logger.info('Customers retrieved from cache');
        return cachedResult;
      }

      // If not in cache, get from repository
      const result = await this.customerRepository.findAll(filters);

      // Store in cache for future requests
      await this.cachePort.set(cacheKey, result);

      this.logger.info('Customers retrieved successfully', {
        total: result.total,
        count: result.customers.length,
      });

      return result;
    } catch (error) {
      this.logger.error('Error listing customers', {
        error: error instanceof Error ? error.message : String(error),
        filters,
      });
      throw error;
    }
  }
}
