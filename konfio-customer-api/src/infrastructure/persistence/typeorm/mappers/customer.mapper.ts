import { Customer } from 'src/domain/model/customer.model';
import { CustomerEntity } from '../entities/customer.entity';
import { ContactInfoMapper } from './contact-info.mapper';
import { PartyMapper } from './party.mapper';
import { ContactInfoEntity } from '../entities/contact-info.entity';

export class CustomerMapper {
  static toDomain(entity: CustomerEntity): Customer {
    const contactInfo = ContactInfoMapper.toDomain(entity.contactInfo);
    const parties =
      entity.parties?.map((party) => PartyMapper.toDomain(party)) || [];

    return new Customer(
      entity.id,
      entity.name,
      entity.taxId,
      entity.type,
      contactInfo,
      parties,
      entity.createdAt,
    );
  }

  static toEntity(domain: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.taxId = domain.taxId;
    entity.type = domain.type;

    entity.contactInfo = domain.contactInfo
      ? ContactInfoMapper.toEntity(domain.contactInfo)
      : new ContactInfoEntity();

    return entity;
  }
}
