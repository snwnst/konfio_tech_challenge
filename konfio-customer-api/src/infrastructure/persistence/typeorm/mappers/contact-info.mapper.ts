import { ContactInfo } from 'src/domain/model/contact-info.model';
import { ContactInfoEntity } from '../entities/contact-info.entity';

export class ContactInfoMapper {
  static toDomain(entity: ContactInfoEntity): ContactInfo {
    return new ContactInfo(
      entity.id,
      entity.email,
      entity.phone,
      entity.address,
    );
  }

  static toEntity(domain: ContactInfo): ContactInfoEntity {
    const entity = new ContactInfoEntity();
    entity.email = domain.email;
    entity.phone = domain.phone;
    entity.address = domain.address;
    return entity;
  }
}
