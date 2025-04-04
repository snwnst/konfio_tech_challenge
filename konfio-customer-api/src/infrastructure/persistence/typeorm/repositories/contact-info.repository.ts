import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactInfoRepositoryPort } from '../../../../application/ports/contact-info.repository.port';
import { ContactInfo } from '../../../../domain/model/contact-info.model';
import { ContactInfoEntity } from '../entities/contact-info.entity';
import { ContactInfoMapper } from '../mappers/contact-info.mapper';

@Injectable()
export class ContactInfoRepository implements ContactInfoRepositoryPort {
  constructor(
    @InjectRepository(ContactInfoEntity)
    private readonly repository: Repository<ContactInfoEntity>,
  ) {}

  async save(contactInfo: ContactInfo): Promise<ContactInfo> {
    const entity = ContactInfoMapper.toEntity(contactInfo);
    const savedEntity = await this.repository.save(entity);
    return ContactInfoMapper.toDomain(savedEntity);
  }

  async findById(id: string): Promise<ContactInfo | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? ContactInfoMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<ContactInfo | null> {
    const entity = await this.repository.findOne({ where: { email } });
    return entity ? ContactInfoMapper.toDomain(entity) : null;
  }
}
