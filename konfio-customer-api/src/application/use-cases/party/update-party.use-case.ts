import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PartyRepositoryPort } from '../../../domain/ports/party.repository.port';
import { Party } from '../../../domain/model/party.model';
import { LoggerPort } from '../../../application/ports/logger.port';
import { UpdatePartyDto } from '../../../infrastructure/api/rest/dtos/party/update-party.dto';

@Injectable()
export class UpdatePartyUseCase {
  constructor(
    @Inject('PartyRepositoryPort')
    private readonly partyRepository: PartyRepositoryPort,
    @Inject('LoggerPort')
    private readonly logger: LoggerPort,
  ) {}

  async execute(
    partyId: string,
    updatePartyDto: UpdatePartyDto,
  ): Promise<Party> {
    try {
      this.logger.info('Updating party', { partyId, updatePartyDto });

      const existingParty = await this.partyRepository.findById(partyId);
      if (!existingParty) {
        this.logger.warn('Party not found for update', { partyId });
        throw new NotFoundException(`Party with ID ${partyId} not found`);
      }

      const updatedParty = await this.partyRepository.update(
        partyId,
        updatePartyDto,
      );
      this.logger.info('Party updated successfully', { partyId });
      return updatedParty;
    } catch (error) {
      this.logger.error('Error updating party', {
        error: error instanceof Error ? error.message : String(error),
        partyId,
        updatePartyDto,
      });
      throw error;
    }
  }
}
