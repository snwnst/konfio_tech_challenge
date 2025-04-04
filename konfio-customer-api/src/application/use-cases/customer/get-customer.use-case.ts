import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Customer } from '../../../domain/model/customer.model';
import { Logger } from '../../../infrastructure/logger/logger.interface';

@Injectable()
export class GetCustomerUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject('Logger')
    private readonly logger: Logger,
  ) {}

  async execute(id: string): Promise<Customer> {
    try {
      this.logger.info('Getting customer by ID', { customerId: id });
      const customer = await this.customerRepository.findById(id);

      if (!customer) {
        this.logger.warn('Customer not found', { customerId: id });
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

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
