import { Party } from '../model/party.model';

export interface PartyRepositoryPort {
  findById(id: string): Promise<Party | null>;
  findAll(): Promise<Party[]>;
  create(party: Party): Promise<Party>;
  update(id: string, party: Party): Promise<Party>;
  delete(id: string): Promise<void>;
}
