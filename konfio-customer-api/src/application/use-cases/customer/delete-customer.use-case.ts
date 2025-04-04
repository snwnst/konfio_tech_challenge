import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Logger } from '../../../infrastructure/logger/logger.interface';
import { KafkaEventPort } from '../../../domain/ports/kafka-event.port';
import { CachePort } from '../../../domain/ports/cache.port';

@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject('Logger')
    private readonly logger: Logger,
    @Inject('KafkaEventPort')
    private readonly kafkaEventPort: KafkaEventPort,
    @Inject('CachePort')
    private readonly cachePort: CachePort,
  ) {}

  async execute(id: string): Promise<void> {
    try {
      this.logger.info('Deleting customer', { customerId: id });

      const customer = await this.customerRepository.findById(id);

      if (!customer) {
        this.logger.warn('Customer not found for deletion', { customerId: id });
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

      await this.customerRepository.delete(id);

      // Invalidate cache for this customer
      const cacheKey = `customer:${id}`;
      await this.cachePort.del(cacheKey);

      // Publish event
      await this.kafkaEventPort.publish('customer.deleted', {
        id: customer.id,
        taxId: customer.taxId,
        type: customer.type,
        name: customer.name,
        deletedAt: new Date().toISOString(),
      });

      this.logger.info('Customer deleted successfully', { customerId: id });
    } catch (error) {
      this.logger.error('Error deleting customer', {
        error: error instanceof Error ? error.message : String(error),
        customerId: id,
      });
      throw error;
    }
  }
}
