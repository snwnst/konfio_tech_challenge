import { PartyRole } from './party-role.model';

export class Party {
  id: string;
  name: string;
  email: string;
  role: PartyRole;
  customerId: string;

  constructor(
    id: string,
    name: string,
    email: string,
    role: PartyRole,
    customerId: string,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.customerId = customerId;
  }

  updateRole(newRole: PartyRole) {
    this.role = newRole;
  }
}
