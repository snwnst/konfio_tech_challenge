import { Customer } from '../../../../domain/model/customer.model';
import { CustomerEntity } from '../entities/customer.entity';

export class CustomerMapper {
  static toDomain(entity: CustomerEntity): Customer {
    return new Customer(entity.id, entity.name, entity.email);
  }

  static toEntity(domain: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.email = domain.email;
    return entity;
  }
}
