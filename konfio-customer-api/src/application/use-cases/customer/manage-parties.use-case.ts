import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CustomerRepositoryPort } from '../../../domain/ports/customer.repository.port';
import { PartyRepositoryPort } from '../../../domain/ports/party.repository.port';
import { PartyRole } from '../../../domain/model/party-role.model';
import { LoggerPort } from '../../../application/ports/logger.port';
import { KafkaEventPort } from '../../../domain/ports/kafka-event.port';
import { CachePort } from '../../../domain/ports/cache.port';

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
    @Inject('LoggerPort')
    private readonly logger: LoggerPort,
    @Inject('KafkaEventPort')
    private readonly kafkaEventPort: KafkaEventPort,
    @Inject('CachePort')
    private readonly cachePort: CachePort,
  ) {}

  async addParty(customerId: string, partyId: string): Promise<void> {
    try {
      this.logger.info('Adding party to customer', { customerId, partyId });

      const customer = await this.customerRepository.findById(customerId);
      if (!customer) {
        this.logger.warn('Customer not found for adding party', { customerId });
        throw new NotFoundException(`Customer with ID ${customerId} not found`);
      }

      const party = await this.partyRepository.findById(partyId);
      if (!party) {
        this.logger.warn('Party not found for adding to customer', { partyId });
        throw new NotFoundException(`Party with ID ${partyId} not found`);
      }

      const existingParties =
        await this.customerRepository.getParties(customerId);
      if (existingParties.includes(partyId)) {
        this.logger.warn('Party already associated with customer', {
          customerId,
          partyId,
        });
        throw new BadRequestException(
          `Party with ID ${partyId} is already associated with customer ${customerId}`,
        );
      }

      await this.customerRepository.addParty(customerId, partyId);

      // Invalidate cache for this customer
      const cacheKey = `customer:${customerId}`;
      await this.cachePort.del(cacheKey);

      this.logger.info('Party added to customer successfully', {
        customerId,
        partyId,
      });

      // Publish party added event
      await this.kafkaEventPort.publish('customer.party.added', {
        customerId,
        partyId,
        partyName: party.name,
        partyEmail: party.email,
        partyRole: party.role,
        addedAt: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error('Error adding party to customer', {
        error: error instanceof Error ? error.message : String(error),
        customerId,
        partyId,
      });
      throw error;
    }
  }

  async updateParty(
    customerId: string,
    partyId: string,
    data: PartyUpdateData,
  ): Promise<void> {
    try {
      this.logger.info('Updating party for customer', {
        customerId,
        partyId,
        data,
      });

      const customer = await this.customerRepository.findById(customerId);
      if (!customer) {
        this.logger.warn('Customer not found for updating party', {
          customerId,
        });
        throw new NotFoundException(`Customer with ID ${customerId} not found`);
      }

      const party = await this.partyRepository.findById(partyId);
      if (!party) {
        this.logger.warn('Party not found for updating', { partyId });
        throw new NotFoundException(`Party with ID ${partyId} not found`);
      }

      const existingParties =
        await this.customerRepository.getParties(customerId);
      if (!existingParties.includes(partyId)) {
        this.logger.warn('Party not associated with customer', {
          customerId,
          partyId,
        });
        throw new BadRequestException(
          `Party with ID ${partyId} is not associated with customer ${customerId}`,
        );
      }

      if (data.role && !Object.values(PartyRole).includes(data.role)) {
        throw new BadRequestException(`Invalid role: ${data.role}`);
      }

      await this.customerRepository.updateParty(customerId, partyId, data);

      // Invalidate cache for this customer
      const cacheKey = `customer:${customerId}`;
      await this.cachePort.del(cacheKey);

      this.logger.info('Party updated successfully', {
        customerId,
        partyId,
        data,
      });

      // Publish party updated event
      await this.kafkaEventPort.publish('customer.party.updated', {
        customerId,
        partyId,
        partyName: party.name,
        partyEmail: party.email,
        partyRole: party.role,
        changes: data,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error('Error updating party', {
        error: error instanceof Error ? error.message : String(error),
        customerId,
        partyId,
        data,
      });
      throw error;
    }
  }

  async getParties(customerId: string): Promise<string[]> {
    try {
      this.logger.info('Getting parties for customer', { customerId });

      const customer = await this.customerRepository.findById(customerId);
      if (!customer) {
        this.logger.warn('Customer not found for getting parties', {
          customerId,
        });
        throw new NotFoundException(`Customer with ID ${customerId} not found`);
      }

      const parties = await this.customerRepository.getParties(customerId);

      this.logger.info('Parties retrieved successfully', {
        customerId,
        partyCount: parties.length,
      });

      return parties;
    } catch (error) {
      this.logger.error('Error getting parties', {
        error: error instanceof Error ? error.message : String(error),
        customerId,
      });
      throw error;
    }
  }
}
