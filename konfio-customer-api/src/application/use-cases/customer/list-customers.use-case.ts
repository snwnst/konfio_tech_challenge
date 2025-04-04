import { Injectable, Inject } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Customer } from '../../../domain/model/customer.model';
import { Logger } from '../../../infrastructure/logger/logger.interface';

@Injectable()
export class ListCustomersUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject('Logger')
    private readonly logger: Logger,
  ) {}

  async execute(filters: {
    enterpriseType?: string;
    page?: number;
    limit?: number;
  }): Promise<{ customers: Customer[]; total: number }> {
    this.logger.info('Listing customers with filters', { filters });
    try {
      const result = await this.customerRepository.findAll(filters);
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
