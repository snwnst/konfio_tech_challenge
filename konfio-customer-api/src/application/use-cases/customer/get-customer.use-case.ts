import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Customer } from '../../../domain/model/customer.model';
import { LoggerPort } from '../../../application/ports/logger.port';
import { CachePort } from '../../../domain/ports/cache.port';

@Injectable()
export class GetCustomerUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject('LoggerPort')
    private readonly logger: LoggerPort,
    @Inject('CachePort')
    private readonly cachePort: CachePort,
  ) {}

  async execute(id: string): Promise<Customer> {
    try {
      this.logger.info('Getting customer by ID', { customerId: id });

      // Try to get from cache first
      const cacheKey = `customer:${id}`;
      const cachedCustomer = await this.cachePort.get<Customer>(cacheKey);

      if (cachedCustomer) {
        this.logger.info('Customer retrieved from cache', { customerId: id });
        return cachedCustomer;
      }

      // If not in cache, get from repository
      const customer = await this.customerRepository.findById(id);

      if (!customer) {
        this.logger.warn('Customer not found', { customerId: id });
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

      // Store in cache for future requests
      await this.cachePort.set(cacheKey, customer);

      this.logger.info('Customer retrieved successfully', {
        customerId: customer.id,
        taxId: customer.taxId,
        type: customer.type,
      });

      return customer;
    } catch (error) {
      this.logger.error('Error getting customer', {
        error: error instanceof Error ? error.message : String(error),
        customerId: id,
      });
      throw error;
    }
  }
}
