import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Logger } from '../../../infrastructure/logger/logger.interface';

@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject('Logger')
    private readonly logger: Logger,
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
    } catch (error) {
      this.logger.error(
        error instanceof Error ? error.message : String(error),
        {
          error: error instanceof Error ? error.message : String(error),
          customerId: id,
        },
      );
      throw error;
    }
  }
}
