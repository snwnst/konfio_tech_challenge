import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRepositoryPort } from '../../../../application/ports/customer.repository.port';
import { Customer } from '../../../../domain/model/customer.model';
import { CustomerEntity } from '../entities/customer.entity';
import { CustomerMapper } from '../mappers/customer.mapper';

@Injectable()
export class CustomerRepository implements CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {}

  async save(customer: Customer): Promise<Customer> {
    const entity = CustomerMapper.toEntity(customer);
    const savedEntity = await this.repository.save(entity);
    return CustomerMapper.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Customer | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Customer[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => CustomerMapper.toDomain(entity));
  }
}
