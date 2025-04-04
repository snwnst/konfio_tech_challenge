import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Customer } from '../../../domain/model/customer.model';
import { CustomerType } from '../../../domain/model/customer-type.model';
import { Logger } from '../../../infrastructure/logger/logger.interface';
import { CreateCustomerDto } from '../../../infrastructure/api/rest/dtos/customer/create-customer.dto';
import { KafkaEventPort } from '../../../domain/ports/kafka-event.port';
import { CachePort } from '../../../domain/ports/cache.port';

@Injectable()
export class CreateCustomerUseCase {
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

  async execute(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      this.logger.info('Creating new customer', { data: createCustomerDto });

      if (!createCustomerDto.taxId) {
        throw new BadRequestException('Tax ID is required');
      }
      if (!createCustomerDto.type) {
        throw new BadRequestException('Enterprise type is required');
      }
      if (!createCustomerDto.name) {
        throw new BadRequestException('Name is required');
      }

      if (!Object.values(CustomerType).includes(createCustomerDto.type)) {
        throw new BadRequestException(
          `Enterprise type must be either ${CustomerType.ENTERPRISE} or ${CustomerType.INDIVIDUAL}`,
        );
      }

      if (
        createCustomerDto.type === CustomerType.ENTERPRISE &&
        createCustomerDto.taxId.length < 10
      ) {
        throw new BadRequestException(
          'Company tax ID must be at least 10 characters long',
        );
      }

      const customer = await this.customerRepository.create(
        createCustomerDto as Customer,
      );

      // Invalidate cache for this customer
      const cacheKey = `customer:${customer.id}`;
      await this.cachePort.del(cacheKey);

      // Publish event
      await this.kafkaEventPort.publish('customer.created', {
        id: customer.id,
        taxId: customer.taxId,
        type: customer.type,
        name: customer.name,
        createdAt: customer.createdAt,
      });

      this.logger.info('Customer created successfully', {
        customerId: customer.id,
        taxId: customer.taxId,
        type: customer.type,
      });

      return customer;
    } catch (error) {
      this.logger.error('Error creating customer', {
        error: error instanceof Error ? error.message : String(error),
        data: createCustomerDto,
      });
      throw error;
    }
  }
}
