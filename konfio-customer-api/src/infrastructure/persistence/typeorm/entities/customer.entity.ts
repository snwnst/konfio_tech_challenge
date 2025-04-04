import { Customer } from 'src/domain/model/customer.model';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
export class CustomerEntity implements Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  toDomain(): Customer {
    return new Customer(this.id, this.name, this.email);
  }

  static fromDomain(customer: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.id = customer.id;
    entity.name = customer.name;
    entity.email = customer.email;
    return entity;
  }
}
