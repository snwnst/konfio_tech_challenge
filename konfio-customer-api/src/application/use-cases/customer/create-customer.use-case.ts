import { Injectable, BadRequestException } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Customer } from '../../../domain/model/customer.model';
import { CustomerType } from 'src/domain/model/customer-type.model';

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(customerData: Partial<Customer>): Promise<Customer> {
    if (!customerData.taxId) {
      throw new BadRequestException('Tax ID is required');
    }
    if (!customerData.type) {
      throw new BadRequestException('Enterprise type is required');
    }
    if (
      ![CustomerType.INDIVIDUAL, CustomerType.INDIVIDUAL].includes(
        customerData.type,
      )
    ) {
      throw new BadRequestException(
        'Enterprise type must be either company or individual',
      );
    }

    return this.customerRepository.create(customerData as Customer);
  }
}
