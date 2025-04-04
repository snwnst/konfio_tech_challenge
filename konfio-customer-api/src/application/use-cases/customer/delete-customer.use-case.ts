import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Logger } from '../../../infrastructure/logger/logger.interface';
import { KafkaEventPort } from '../../../domain/ports/kafka-event.port';

@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject('Logger')
    private readonly logger: Logger,
    @Inject('KafkaEventPort')
    private readonly kafkaEventPort: KafkaEventPort,
  ) {}

  async execute(id: string): Promise<void> {
    try {
      this.logger.info('Deleting customer', { customerId: id });

      const existingCustomer = await this.customerRepository.findById(id);
      if (!existingCustomer) {
        this.logger.warn('Customer not found for deletion', { customerId: id });
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

      await this.customerRepository.delete(id);

      this.logger.info('Customer deleted successfully', {
        customerId: id,
        taxId: existingCustomer.taxId,
        type: existingCustomer.type,
      });

      // Publish customer deleted event
      await this.kafkaEventPort.publish('customer.deleted', {
        id: existingCustomer.id,
        taxId: existingCustomer.taxId,
        name: existingCustomer.name,
        type: existingCustomer.type,
        deletedAt: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error('Error deleting customer', {
        error: error instanceof Error ? error.message : String(error),
        customerId: id,
      });
      throw error;
    }
  }
}
