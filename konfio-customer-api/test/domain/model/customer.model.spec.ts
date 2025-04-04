import { Customer } from '../../../src/domain/model/customer.model';
import { CustomerType } from '../../../src/domain/model/customer-type.model';
import { ContactInfo } from '../../../src/domain/model/contact-info.model';
import { Party } from '../../../src/domain/model/party.model';
import { PartyRole } from '../../../src/domain/model/party-role.model';

describe('Customer Model', () => {
  let customer: Customer;
  const mockContactInfo: ContactInfo = new ContactInfo('1', 'test@example.com');
  const mockDate = new Date();

  beforeEach(() => {
    customer = new Customer(
      '1',
      'Test Customer',
      'TAX123',
      CustomerType.INDIVIDUAL,
      mockContactInfo,
      [],
      mockDate,
    );
  });

  describe('constructor', () => {
    it('should create a customer with all required properties', () => {
      expect(customer.id).toBe('1');
      expect(customer.name).toBe('Test Customer');
      expect(customer.taxId).toBe('TAX123');
      expect(customer.type).toBe(CustomerType.INDIVIDUAL);
      expect(customer.contactInfo).toBe(mockContactInfo);
      expect(customer.parties).toEqual([]);
      expect(customer.createdAt).toBe(mockDate);
    });
  });

  describe('addParty', () => {
    it('should throw error when adding party to non-enterprise customer', () => {
      const party = new Party(
        '1',
        'Test Party',
        'party@test.com',
        PartyRole.ADMIN,
        '1',
      );

      expect(() => {
        customer.addParty(party);
      }).toThrow('Only enterprise customers can have parties');
    });

    it('should add party to enterprise customer', () => {
      customer = new Customer(
        '1',
        'Test Enterprise',
        'TAX123',
        CustomerType.ENTERPRISE,
        mockContactInfo,
        [],
        mockDate,
      );

      const party = new Party(
        '1',
        'Test Party',
        'party@test.com',
        PartyRole.ADMIN,
        '1',
      );
      customer.addParty(party);

      expect(customer.parties).toContain(party);
    });
  });

  describe('changeType', () => {
    it('should not change type if new type is the same', () => {
      const originalType = customer.type;
      customer.changeType(CustomerType.INDIVIDUAL);
      expect(customer.type).toBe(originalType);
    });

    it('should change type and clear parties when changing to INDIVIDUAL', () => {
      customer = new Customer(
        '1',
        'Test Enterprise',
        'TAX123',
        CustomerType.ENTERPRISE,
        mockContactInfo,
        [new Party('1', 'Test Party', 'party@test.com', PartyRole.ADMIN, '1')],
        mockDate,
      );

      customer.changeType(CustomerType.INDIVIDUAL);

      expect(customer.type).toBe(CustomerType.INDIVIDUAL);
      expect(customer.parties).toEqual([]);
    });

    it('should change type without affecting parties when changing to ENTERPRISE', () => {
      const party = new Party(
        '1',
        'Test Party',
        'party@test.com',
        PartyRole.ADMIN,
        '1',
      );
      customer.parties = [party];

      customer.changeType(CustomerType.ENTERPRISE);

      expect(customer.type).toBe(CustomerType.ENTERPRISE);
      expect(customer.parties).toContain(party);
    });
  });
});
