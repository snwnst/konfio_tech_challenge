import { ContactInfo } from '../../domain/model/contact-info.model';

export interface ContactInfoRepositoryPort {
  save(contactInfo: ContactInfo): Promise<ContactInfo>;
  findById(id: string): Promise<ContactInfo | null>;
  findByEmail(email: string): Promise<ContactInfo | null>;
}
