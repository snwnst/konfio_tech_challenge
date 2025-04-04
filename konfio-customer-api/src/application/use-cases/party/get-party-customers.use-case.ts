import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PartyRepositoryPort } from '../../../domain/ports/party.repository.port';
import { Logger } from '../../../infrastructure/logger/logger.interface';

@Injectable()
export class GetPartyCustomersUseCase {
  constructor(
    @Inject('PartyRepositoryPort')
    private readonly partyRepository: PartyRepositoryPort,
    @Inject('Logger')
    private readonly logger: Logger,
  ) {}

  async execute(partyId: string): Promise<string[]> {
    try {
      this.logger.info('Getting customers for party', { partyId });

      const party = await this.partyRepository.findById(partyId);
      if (!party) {
        this.logger.warn('Party not found for getting customers', { partyId });
        throw new NotFoundException(`Party with ID ${partyId} not found`);
      }

      const customers =
        await this.partyRepository.getCustomersByPartyId(partyId);

      this.logger.info('Customers retrieved successfully for party', {
        partyId,
        customerCount: customers.length,
      });

      return customers;
    } catch (error) {
      this.logger.error('Error getting customers for party', {
        error: error instanceof Error ? error.message : String(error),
        partyId,
      });
      throw error;
    }
  }
}
