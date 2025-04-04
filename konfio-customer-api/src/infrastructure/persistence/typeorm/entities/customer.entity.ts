import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PartyEntity } from './party.entity';
import { ContactInfoEntity } from './contact-info.entity';
import { CustomerType } from 'src/domain/model/customer-type.model';

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

  @OneToMany(() => PartyEntity, (party) => party.customer)
  parties: PartyEntity[];

  @OneToOne(() => ContactInfoEntity, (contactInfo) => contactInfo.customer)
  contactInfo: ContactInfoEntity;
}
