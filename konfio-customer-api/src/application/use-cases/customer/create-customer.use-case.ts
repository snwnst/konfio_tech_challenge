import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Customer } from '../../../domain/model/customer.model';
import { CustomerType } from '../../../domain/model/customer-type.model';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(customerData: Partial<Customer>): Promise<Customer> {
    if (!customerData.taxId) {
      throw new BadRequestException('Tax ID is required');
    }
    if (!customerData.type) {
      throw new BadRequestException('Enterprise type is required');
    }
    if (!customerData.name) {
      throw new BadRequestException('Name is required');
    }

    if (!Object.values(CustomerType).includes(customerData.type)) {
      throw new BadRequestException(
        `Enterprise type must be either ${CustomerType.ENTERPRISE} or ${CustomerType.INDIVIDUAL}`,
      );
    }

    if (
      customerData.type === CustomerType.ENTERPRISE &&
      customerData.taxId.length < 10
    ) {
      throw new BadRequestException(
        'Company tax ID must be at least 10 characters long',
      );
    }
    return this.customerRepository.create(customerData as Customer);
  }
}
