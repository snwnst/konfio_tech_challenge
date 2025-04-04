import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartyRepositoryPort } from '../../../../application/ports/party.repository.port';
import { Party } from '../../../../domain/model/party.model';
import { PartyEntity } from '../entities/party.entity';
import { PartyMapper } from '../mappers/party.mapper';

@Injectable()
export class PartyRepository implements PartyRepositoryPort {
  constructor(
    @InjectRepository(PartyEntity)
    private readonly repository: Repository<PartyEntity>,
  ) {}

  async save(party: Party): Promise<Party> {
    const entity = PartyMapper.toEntity(party);
    const savedEntity = await this.repository.save(entity);
    return PartyMapper.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Party | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? PartyMapper.toDomain(entity) : null;
  }

  async findByCustomerId(customerId: string): Promise<Party[]> {
    const entities = await this.repository.find({ where: { customerId } });
    return entities.map((entity) => PartyMapper.toDomain(entity));
  }

  async findByEmail(email: string): Promise<Party | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? PartyMapper.toDomain(entity) : null;
  }
}
