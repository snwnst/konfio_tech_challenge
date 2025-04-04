import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { Customer } from '../../../domain/model/customer.model';
import { CustomerType } from 'src/domain/model/customer-type.model';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(
    id: string,
    customerData: Partial<Customer>,
  ): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findById(id);
    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    if (
      customerData.type &&
      ![CustomerType.INDIVIDUAL, CustomerType.INDIVIDUAL].includes(
        customerData.type,
      )
    ) {
      throw new BadRequestException(
        'Enterprise type must be either company or individual',
      );
    }

    return this.customerRepository.update(id, customerData);
  }
}
