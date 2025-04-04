import { Party } from '../../../src/domain/model/party.model';
import { PartyRole } from '../../../src/domain/model/party-role.model';

describe('Party Model', () => {
  let party: Party;

  beforeEach(() => {
    party = new Party(
      '1',
      'Test Party',
      'test@example.com',
      PartyRole.ADMIN,
      'customer1',
    );
  });

  describe('constructor', () => {
    it('should create a party with all required properties', () => {
      expect(party.id).toBe('1');
      expect(party.name).toBe('Test Party');
      expect(party.email).toBe('test@example.com');
      expect(party.role).toBe(PartyRole.ADMIN);
      expect(party.customerId).toBe('customer1');
    });
  });

  describe('updateRole', () => {
    it('should update the role of the party', () => {
      party.updateRole(PartyRole.EMPLOYEE);
      expect(party.role).toBe(PartyRole.EMPLOYEE);
    });

    it('should allow updating to the same role', () => {
      const originalRole = party.role;
      party.updateRole(PartyRole.ADMIN);
      expect(party.role).toBe(originalRole);
    });
  });
});
