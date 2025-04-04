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
import { KafkaEventPort } from '../../../domain/ports/kafka-event.port';
import { CachePort } from '../../../domain/ports/cache.port';
import { UpdateCustomerDto } from '../../../infrastructure/api/rest/dtos/customer/update-customer.dto';

@Injectable()
export class UpdateCustomerUseCase {
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

      if (updateCustomerDto.type) {
        if (!Object.values(CustomerType).includes(updateCustomerDto.type)) {
          this.logger.warn('Invalid enterprise type provided', {
            customerId: id,
            type: updateCustomerDto.type,
          });
          throw new BadRequestException(
            `Enterprise type must be either ${CustomerType.ENTERPRISE} or ${CustomerType.INDIVIDUAL}`,
          );
        }

        if (
          updateCustomerDto.type === CustomerType.ENTERPRISE &&
          updateCustomerDto.taxId &&
          updateCustomerDto.taxId.length < 10
        ) {
          this.logger.warn('Invalid company tax ID length', {
            customerId: id,
            taxId: updateCustomerDto.taxId,
          });
          throw new BadRequestException(
            'Company tax ID must be at least 10 characters long',
          );
        }
      }

      const updatedCustomer = await this.customerRepository.update(id, {
        ...existingCustomer,
        ...updateCustomerDto,
      } as Customer);

      // Invalidate cache for this customer
      const cacheKey = `customer:${id}`;
      await this.cachePort.del(cacheKey);

      // Publish event
      await this.kafkaEventPort.publish('customer.updated', {
        id: updatedCustomer.id,
        taxId: updatedCustomer.taxId,
        type: updatedCustomer.type,
        name: updatedCustomer.name,
        updatedAt: new Date().toISOString(),
      });

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
        data: updateCustomerDto,
      });
      throw error;
    }
  }
}
