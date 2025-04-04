export class ContactInfo {
  id: string;
  email: string;
  phone?: string;
  address?: string;

  constructor(id: string, email: string, phone?: string, address?: string) {
    this.id = id;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }
}
