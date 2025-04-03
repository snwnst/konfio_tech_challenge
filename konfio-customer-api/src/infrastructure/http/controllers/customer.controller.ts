import { Controller, Get, Param } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../application/ports/customer.repository.port';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.customerRepository.findById(id);
  }
}
