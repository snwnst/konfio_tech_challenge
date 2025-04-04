import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Customer } from '../../../domain/model/customer.model';
import { CustomerType } from '../../../domain/model/customer-type.model';
import { Logger } from '../../../infrastructure/logger/logger.interface';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject('Logger')
    private readonly logger: Logger,
  ) {}

  async execute(
    id: string,
    customerData: Partial<Customer>,
  ): Promise<Customer> {
    try {
      this.logger.info('Updating customer', {
        customerId: id,
        data: customerData,
      });

      const existingCustomer = await this.customerRepository.findById(id);
      if (!existingCustomer) {
        this.logger.warn('Customer not found for update', { customerId: id });
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

      if (customerData.type) {
        if (!Object.values(CustomerType).includes(customerData.type)) {
          this.logger.warn('Invalid enterprise type provided', {
            customerId: id,
            type: customerData.type,
          });
          throw new BadRequestException(
            `Enterprise type must be either ${CustomerType.ENTERPRISE} or ${CustomerType.INDIVIDUAL}`,
          );
        }

        if (
          customerData.type === CustomerType.ENTERPRISE &&
          customerData.taxId &&
          customerData.taxId.length < 10
        ) {
          this.logger.warn('Invalid company tax ID length', {
            customerId: id,
            taxId: customerData.taxId,
          });
          throw new BadRequestException(
            'Company tax ID must be at least 10 characters long',
          );
        }
      }

      const updatedCustomer = await this.customerRepository.update(
        id,
        customerData,
      );

      this.logger.info('Customer updated successfully', {
        customerId: updatedCustomer.id,
        taxId: updatedCustomer.taxId,
        type: updatedCustomer.type,
      });

      return updatedCustomer;
    } catch (error) {
      this.logger.error('Error updating customer', {
        error: error instanceof Error ? error.message : String(error),
        customerId: id,
        data: customerData,
      });
      throw error;
    }
  }
}
