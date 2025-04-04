import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Customer } from '../../../domain/model/customer.model';
import { CustomerType } from '../../../domain/model/customer-type.model';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
  ) {}

  async execute(
    id: string,
    customerData: Partial<Customer>,
  ): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findById(id);
    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    if (customerData.type) {
      if (!Object.values(CustomerType).includes(customerData.type)) {
        throw new BadRequestException(
          `Enterprise type must be either ${CustomerType.ENTERPRISE} or ${CustomerType.INDIVIDUAL}`,
        );
      }

      if (
        customerData.type === CustomerType.ENTERPRISE &&
        customerData.taxId &&
        customerData.taxId.length < 10
      ) {
        throw new BadRequestException(
          'Company tax ID must be at least 10 characters long',
        );
      }
    }

    return this.customerRepository.update(id, customerData);
  }
}
