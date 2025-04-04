import { Injectable, Inject } from '@nestjs/common';
import { PartyRepositoryPort } from '../../../domain/ports/party.repository.port';
import { Party } from '../../../domain/model/party.model';
import { Logger } from '../../../infrastructure/logger/logger.interface';
import { CreatePartyDto } from '../../../infrastructure/api/rest/dtos/party/create-party.dto';

@Injectable()
export class CreatePartyUseCase {
  constructor(
    @Inject('PartyRepositoryPort')
    private readonly partyRepository: PartyRepositoryPort,
    @Inject('Logger')
    private readonly logger: Logger,
  ) {}

  async execute(createPartyDto: CreatePartyDto): Promise<Party> {
    try {
      this.logger.info('Creating a new party', { createPartyDto });

      // Convert DTO to domain model
      const party = createPartyDto as Party;

      const createdParty = await this.partyRepository.create(party);
      this.logger.info('Party created successfully', {
        partyId: createdParty.id,
      });
      return createdParty;
    } catch (error) {
      this.logger.error('Error creating party', {
        error: error instanceof Error ? error.message : String(error),
        createPartyDto,
      });
      throw error;
    }
  }
}
