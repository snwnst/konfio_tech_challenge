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
}
