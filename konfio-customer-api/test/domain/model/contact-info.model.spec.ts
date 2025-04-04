import { ContactInfo } from '../../../src/domain/model/contact-info.model';

describe('ContactInfo Model', () => {
  describe('constructor', () => {
    it('should create contact info with required properties', () => {
      const contactInfo = new ContactInfo('1', 'test@example.com');

      expect(contactInfo.id).toBe('1');
      expect(contactInfo.email).toBe('test@example.com');
      expect(contactInfo.phone).toBeUndefined();
      expect(contactInfo.address).toBeUndefined();
    });

    it('should create contact info with all properties', () => {
      const contactInfo = new ContactInfo(
        '1',
        'test@example.com',
        '1234567890',
        '123 Test St',
      );

      expect(contactInfo.id).toBe('1');
      expect(contactInfo.email).toBe('test@example.com');
      expect(contactInfo.phone).toBe('1234567890');
      expect(contactInfo.address).toBe('123 Test St');
    });

    it('should create contact info with only phone', () => {
      const contactInfo = new ContactInfo(
        '1',
        'test@example.com',
        '1234567890',
      );

      expect(contactInfo.id).toBe('1');
      expect(contactInfo.email).toBe('test@example.com');
      expect(contactInfo.phone).toBe('1234567890');
      expect(contactInfo.address).toBeUndefined();
    });

    it('should create contact info with only address', () => {
      const contactInfo = new ContactInfo(
        '1',
        'test@example.com',
        undefined,
        '123 Test St',
      );

      expect(contactInfo.id).toBe('1');
      expect(contactInfo.email).toBe('test@example.com');
      expect(contactInfo.phone).toBeUndefined();
      expect(contactInfo.address).toBe('123 Test St');
    });
  });
});
