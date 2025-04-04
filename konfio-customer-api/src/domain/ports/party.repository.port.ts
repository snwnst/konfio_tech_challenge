import { Party } from '../model/party.model';

export interface PartyRepositoryPort {
  findById(id: string): Promise<Party | null>;
  create(party: Party): Promise<Party>;
  update(id: string, party: Partial<Party>): Promise<Party>;
  getCustomersByPartyId(partyId: string): Promise<string[]>;
  delete(id: string): Promise<void>;
}
