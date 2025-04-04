import { Injectable, NotFoundException } from '@nestjs/common';
import { PartyRepositoryPort } from '../../../domain/ports/party.repository.port';

@Injectable()
export class GetPartyCustomersUseCase {
  constructor(private readonly partyRepository: PartyRepositoryPort) {}

  async execute(partyId: string): Promise<string[]> {
    const party = await this.partyRepository.findById(partyId);
    if (!party) {
      throw new NotFoundException(`Party with ID ${partyId} not found`);
    }

    return this.partyRepository.getCustomersByPartyId(partyId);
  }
}
