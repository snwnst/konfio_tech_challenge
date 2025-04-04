import { Party } from 'src/domain/model/party.model';
import { PartyEntity } from '../entities/party.entity';

export class PartyMapper {
  static toDomain(entity: PartyEntity): Party {
    return new Party(
      entity.id,
      entity.name,
      entity.email,
      entity.role,
      entity.customerId,
    );
  }

  static toEntity(domain: Party): PartyEntity {
    const entity = new PartyEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.email = domain.email;
    entity.role = domain.role;
    entity.customerId = domain.customerId;
    return entity;
  }
}
