import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';

@Injectable()
export class ManagePartiesUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async addParty(customerId: string, partyId: string): Promise<void> {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    await this.customerRepository.addParty(customerId, partyId);
  }

  async updateParty(
    customerId: string,
    partyId: string,
    data: any,
  ): Promise<void> {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    await this.customerRepository.updateParty(customerId, partyId, data);
  }

  async getParties(customerId: string): Promise<string[]> {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return this.customerRepository.getParties(customerId);
  }
}
