import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { PartyRepositoryPort } from '../../../domain/ports/party.repository.port';
import { PartyRole } from '../../../domain/model/party-role.model';

interface PartyUpdateData {
  name?: string;
  email?: string;
  role?: PartyRole;
}

@Injectable()
export class ManagePartiesUseCase {
  constructor(
    @Inject('CustomerRepositoryPort')
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject('PartyRepositoryPort')
    private readonly partyRepository: PartyRepositoryPort,
  ) {}

  async addParty(customerId: string, partyId: string): Promise<void> {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const party = await this.partyRepository.findById(partyId);
    if (!party) {
      throw new NotFoundException(`Party with ID ${partyId} not found`);
    }

    const existingParties =
      await this.customerRepository.getParties(customerId);
    if (existingParties.includes(partyId)) {
      throw new BadRequestException(
        `Party with ID ${partyId} is already associated with customer ${customerId}`,
      );
    }

    await this.customerRepository.addParty(customerId, partyId);
  }

  async updateParty(
    customerId: string,
    partyId: string,
    data: PartyUpdateData,
  ): Promise<void> {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const party = await this.partyRepository.findById(partyId);
    if (!party) {
      throw new NotFoundException(`Party with ID ${partyId} not found`);
    }

    const existingParties =
      await this.customerRepository.getParties(customerId);
    if (!existingParties.includes(partyId)) {
      throw new BadRequestException(
        `Party with ID ${partyId} is not associated with customer ${customerId}`,
      );
    }

    if (data.role && !Object.values(PartyRole).includes(data.role)) {
      throw new BadRequestException(`Invalid role: ${data.role}`);
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
