import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity('contact_info')
export class ContactInfoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @OneToOne(() => CustomerEntity, (customer) => customer.contactInfo)
  customer: CustomerEntity;
}
