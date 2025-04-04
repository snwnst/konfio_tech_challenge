import { PartyRole } from '../../../../domain/model/party-role.model';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CustomerEntity } from './customer.entity';

@Entity('parties')
export class PartyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: PartyRole,
    default: PartyRole.READ_ONLY,
  })
  role: PartyRole;

  @Column()
  customerId: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.parties)
  customer: CustomerEntity;
}
