import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PartyEntity } from './party.entity';
import { ContactInfoEntity } from './contact-info.entity';
import { CustomerType } from '../../../../domain/model/customer-type.model';

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  taxId: string;

  @Column({
    type: 'enum',
    enum: CustomerType,
    default: CustomerType.INDIVIDUAL,
  })
  type: CustomerType;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => PartyEntity, (party) => party.customer)
  parties: PartyEntity[];

  @ManyToOne(() => ContactInfoEntity, (contactInfo) => contactInfo.customers)
  contactInfo: ContactInfoEntity;
}
