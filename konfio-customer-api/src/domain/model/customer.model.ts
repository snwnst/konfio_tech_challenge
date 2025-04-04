import { ContactInfo } from './contact-info.model';
import { CustomerType } from './customer-type.model';
import { Party } from './party.model';

export class Customer {
  readonly id: string;
  name: string;
  taxId: string;
  type: CustomerType;
  contactInfo: ContactInfo;
  parties: Party[] = [];
  createdAt: Date;

  constructor(
    id: string,
    name: string,
    taxId: string,
    type: CustomerType,
    contactInfo: ContactInfo,
    parties: Party[],
    createdAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.taxId = taxId;
    this.type = type;
    this.contactInfo = contactInfo;
    this.parties = parties;
    this.createdAt = createdAt;
  }

  addParty(party: Party) {
    if (this.type !== CustomerType.ENTERPRISE) {
      throw new Error('Only enterprise customers can have parties');
    }
    this.parties.push(party);
  }

  changeType(newType: CustomerType) {
    if (this.type === newType) return;
    this.type = newType;
    if (newType === CustomerType.INDIVIDUAL) {
      this.parties = [];
    }
  }
}
