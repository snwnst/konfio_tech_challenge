import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRepositoryPort } from '../../../../domain/ports/customer.repository.port';
import { Customer } from '../../../../domain/model/customer.model';
import { CustomerMapper } from '../mappers/customer.mapper';
import { CustomerEntity } from '../entities/customer.entity';
import { PartyEntity } from '../entities/party.entity';
import { PartyRole } from '../../../../domain/model/party-role.model';

interface PartyUpdateData {
  name?: string;
  email?: string;
  role?: PartyRole;
}

@Injectable()
export class CustomerRepository implements CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
    @InjectRepository(PartyEntity)
    private readonly partyRepository: Repository<PartyEntity>,
  ) {}

  async findAll(filters: {
    enterpriseType?: string;
    page?: number;
    limit?: number;
  }): Promise<{ customers: Customer[]; total: number }> {
    const query = this.repository.createQueryBuilder('customer');

    if (filters.enterpriseType) {
      query.andWhere('customer.type = :enterpriseType', {
        enterpriseType: filters.enterpriseType,
      });
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [entities, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      customers: entities.map((entity) => CustomerMapper.toDomain(entity)),
      total,
    };
  }

  async findById(id: string): Promise<Customer | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async create(customer: Customer): Promise<Customer> {
    const entity = CustomerMapper.toEntity(customer);
    const savedEntity = await this.repository.save(entity);
    return CustomerMapper.toDomain(savedEntity);
  }

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    const entity = CustomerMapper.toEntity(customer as Customer);
    await this.repository.update(id, entity);
    const updatedEntity = await this.repository.findOne({ where: { id } });
    if (!updatedEntity) {
      throw new Error(`Customer with ID ${id} not found`);
    }
    return CustomerMapper.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { isDeleted: true });
  }

  async addParty(customerId: string, partyId: string): Promise<void> {
    const customer = await this.repository.findOne({
      where: { id: customerId },
      relations: ['parties'],
    });
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }
    const party = await this.partyRepository.findOne({
      where: { id: partyId },
    });
    if (!party) {
      throw new Error(`Party with ID ${partyId} not found`);
    }
    customer.parties.push(party);
    await this.repository.save(customer);
  }

  async getParties(customerId: string): Promise<string[]> {
    const customer = await this.repository.findOne({
      where: { id: customerId },
      relations: ['parties'],
    });
    if (!customer) {
      return [];
    }
    return customer.parties.map((party) => party.id);
  }

  async updateParty(
    customerId: string,
    partyId: string,
    data: PartyUpdateData,
  ): Promise<void> {
    const customer = await this.repository.findOne({
      where: { id: customerId },
      relations: ['parties'],
    });
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }
    const party = await this.partyRepository.findOne({
      where: { id: partyId },
    });
    if (!party) {
      throw new Error(`Party with ID ${partyId} not found`);
    }

    if (data.name) party.name = data.name;
    if (data.email) party.email = data.email;
    if (data.role) party.role = data.role;

    await this.partyRepository.save(party);
  }
}
