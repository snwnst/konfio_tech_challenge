import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PartyRepositoryPort } from '../../../domain/ports/party.repository.port';
import { LoggerPort } from '../../../application/ports/logger.port';

@Injectable()
export class DeletePartyUseCase {
  constructor(
    @Inject('PartyRepositoryPort')
    private readonly partyRepository: PartyRepositoryPort,
    @Inject('LoggerPort')
    private readonly logger: LoggerPort,
  ) {}

  async execute(partyId: string): Promise<void> {
    try {
      this.logger.info('Deleting party', { partyId });

      const party = await this.partyRepository.findById(partyId);
      if (!party) {
        this.logger.warn('Party not found for deletion', { partyId });
        throw new NotFoundException(`Party with ID ${partyId} not found`);
      }

      await this.partyRepository.delete(partyId);
      this.logger.info('Party deleted successfully', { partyId });
    } catch (error) {
      this.logger.error('Error deleting party', {
        error: error instanceof Error ? error.message : String(error),
        partyId,
      });
      throw error;
    }
  }
}
