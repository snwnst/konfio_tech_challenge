import { Party } from '../../domain/model/party.model';

export interface PartyRepositoryPort {
  save(party: Party): Promise<Party>;
  findById(id: string): Promise<Party | null>;
  findByCustomerId(customerId: string): Promise<Party[]>;
  findByEmail(email: string): Promise<Party | null>;
}
