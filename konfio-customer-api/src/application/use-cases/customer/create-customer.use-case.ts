import { Inject, Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Customer } from '../../../domain/model/customer.model';
import { LoggerPort } from '../../../application/ports/logger.port';
import { CreateCustomerDto } from '../../../infrastructure/api/rest/dtos/customer/create-customer.dto';
import { KafkaEventPort } from '../../../domain/ports/kafka-event.port';
import { CachePort } from '../../../domain/ports/cache.port';

@Injectable()
export class CreateCustomerUseCase {
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

  async execute(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      this.logger.info('Creating new customer', { data: createCustomerDto });

      const customer = await this.customerRepository.create(
        createCustomerDto as Customer,
      );

      const cacheKey = `customer:${customer.id}`;
      await this.cachePort.del(cacheKey);

      await this.kafkaEventPort.publish('customer.created', customer);

      this.logger.info('Customer created successfully', customer);

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
