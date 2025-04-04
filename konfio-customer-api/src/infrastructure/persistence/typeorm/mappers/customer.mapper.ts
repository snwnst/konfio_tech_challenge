import { Customer } from 'src/domain/model/customer.model';
import { CustomerEntity } from '../entities/customer.entity';
import { ContactInfoMapper } from './contact-info.mapper';
import { PartyMapper } from './party.mapper';

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
    );
  }

  static toEntity(domain: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.taxId = domain.taxId;
    entity.type = domain.type;

    entity.contactInfo = ContactInfoMapper.toEntity(domain.contactInfo);

    if (domain.parties) {
      entity.parties = domain.parties.map((party) =>
        PartyMapper.toEntity(party),
      );
    }

    return entity;
  }
}
