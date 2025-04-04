import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Customer } from '../../../domain/model/customer.model';
import { LoggerPort } from '../../../application/ports/logger.port';
import { KafkaEventPort } from '../../../domain/ports/kafka-event.port';
import { CachePort } from '../../../domain/ports/cache.port';
import { UpdateCustomerDto } from '../../../infrastructure/api/rest/dtos/customer/update-customer.dto';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject('LoggerPort')
    private readonly logger: LoggerPort,
    @Inject('KafkaEventPort')
    private readonly kafkaEventPort: KafkaEventPort,
    @Inject('CachePort')
    private readonly cachePort: CachePort,
  ) {}

  async execute(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    try {
      this.logger.info('Updating customer', {
        customerId: id,
        data: updateCustomerDto,
      });

      const existingCustomer = await this.customerRepository.findById(id);

      if (!existingCustomer) {
        this.logger.warn('Customer not found for update', { customerId: id });
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

      const updatedCustomer = await this.customerRepository.update(id, {
        ...existingCustomer,
        ...updateCustomerDto,
      } as Customer);

      // Invalidate cache for this customer
      const cacheKey = `customer:${id}`;
      await this.cachePort.del(cacheKey);

      // Publish event
      await this.kafkaEventPort.publish('customer.updated', updatedCustomer);

      this.logger.info('Customer updated successfully', updatedCustomer);

      return updatedCustomer;
    } catch (error) {
      this.logger.error('Error updating customer', {
        error: error instanceof Error ? error.message : String(error),
        customerId: id,
        data: updateCustomerDto,
      });
      throw error;
    }
  }
}
