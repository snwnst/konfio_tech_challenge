import { ManagePartiesUseCase } from '../../../../src/application/use-cases/customer/manage-parties.use-case';
import { CustomerRepositoryPort } from '../../../../src/domain/ports/customer.repository.port';
import { PartyRepositoryPort } from '../../../../src/domain/ports/party.repository.port';
import { LoggerPort } from '../../../../src/application/ports/logger.port';
import { KafkaEventPort } from '../../../../src/domain/ports/kafka-event.port';
import { CachePort } from '../../../../src/domain/ports/cache.port';
import { Customer } from '../../../../src/domain/model/customer.model';
import { CustomerType } from '../../../../src/domain/model/customer-type.model';
import { Party } from '../../../../src/domain/model/party.model';
import { PartyRole } from '../../../../src/domain/model/party-role.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ManagePartiesUseCase', () => {
  let useCase: ManagePartiesUseCase;
  let customerRepository: jest.Mocked<CustomerRepositoryPort>;
  let partyRepository: jest.Mocked<PartyRepositoryPort>;
  let logger: jest.Mocked<LoggerPort>;
  let kafkaEventPort: jest.Mocked<KafkaEventPort>;
  let cachePort: jest.Mocked<CachePort>;

  const mockCustomer = new Customer(
    '1',
    'Test Customer',
    'TAX123',
    CustomerType.ENTERPRISE,
    {
      id: '1',
      email: 'test@example.com',
      phone: '1234567890',
      address: '123 Test St',
    },
    [],
    new Date(),
  );

  const mockParty = new Party(
    '1',
    'Test Party',
    'party@example.com',
    PartyRole.ADMIN,
    '1',
  );

  beforeEach(() => {
    customerRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addParty: jest.fn(),
      getParties: jest.fn(),
      updateParty: jest.fn(),
    } as jest.Mocked<CustomerRepositoryPort>;

    partyRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<PartyRepositoryPort>;

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as jest.Mocked<LoggerPort>;

    kafkaEventPort = {
      publish: jest.fn(),
    } as unknown as jest.Mocked<KafkaEventPort>;

    cachePort = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      reset: jest.fn(),
    } as jest.Mocked<CachePort>;

    useCase = new ManagePartiesUseCase(
      customerRepository,
      partyRepository,
      logger,
      kafkaEventPort,
      cachePort,
    );
  });

  describe('addParty', () => {
    it('should successfully add a party to a customer', async () => {
      customerRepository.findById.mockResolvedValue(mockCustomer);
      partyRepository.findById.mockResolvedValue(mockParty);
      customerRepository.getParties.mockResolvedValue([]);

      await useCase.addParty('1', '1');

      expect(customerRepository.addParty).toHaveBeenCalledWith('1', '1');
      expect(cachePort.del).toHaveBeenCalledWith('customer:1');
      expect(kafkaEventPort.publish).toHaveBeenCalledWith(
        'customer.party.added',
        expect.objectContaining({
          customerId: '1',
          partyId: '1',
          partyName: mockParty.name,
          partyEmail: mockParty.email,
          partyRole: mockParty.role,
        }),
      );
    });

    it('should throw NotFoundException when customer not found', async () => {
      customerRepository.findById.mockResolvedValue(null);

      await expect(useCase.addParty('1', '1')).rejects.toThrow(
        NotFoundException,
      );
      expect(customerRepository.addParty).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when party not found', async () => {
      customerRepository.findById.mockResolvedValue(mockCustomer);
      partyRepository.findById.mockResolvedValue(null);

      await expect(useCase.addParty('1', '1')).rejects.toThrow(
        NotFoundException,
      );
      expect(customerRepository.addParty).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when party already associated', async () => {
      customerRepository.findById.mockResolvedValue(mockCustomer);
      partyRepository.findById.mockResolvedValue(mockParty);
      customerRepository.getParties.mockResolvedValue(['1']);

      await expect(useCase.addParty('1', '1')).rejects.toThrow(
        BadRequestException,
      );
      expect(customerRepository.addParty).not.toHaveBeenCalled();
    });
  });

  describe('updateParty', () => {
    const updateData = {
      name: 'Updated Party',
      email: 'updated@example.com',
      role: PartyRole.ADMIN,
    };

    it('should successfully update a party', async () => {
      customerRepository.findById.mockResolvedValue(mockCustomer);
      partyRepository.findById.mockResolvedValue(mockParty);
      customerRepository.getParties.mockResolvedValue(['1']);

      await useCase.updateParty('1', '1', updateData);

      expect(customerRepository.updateParty).toHaveBeenCalledWith(
        '1',
        '1',
        updateData,
      );
      expect(cachePort.del).toHaveBeenCalledWith('customer:1');
      expect(kafkaEventPort.publish).toHaveBeenCalledWith(
        'customer.party.updated',
        expect.objectContaining({
          customerId: '1',
          partyId: '1',
          changes: updateData,
        }),
      );
    });

    it('should throw NotFoundException when customer not found', async () => {
      customerRepository.findById.mockResolvedValue(null);

      await expect(useCase.updateParty('1', '1', updateData)).rejects.toThrow(
        NotFoundException,
      );
      expect(customerRepository.updateParty).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when party not found', async () => {
      customerRepository.findById.mockResolvedValue(mockCustomer);
      partyRepository.findById.mockResolvedValue(null);

      await expect(useCase.updateParty('1', '1', updateData)).rejects.toThrow(
        NotFoundException,
      );
      expect(customerRepository.updateParty).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when party not associated', async () => {
      customerRepository.findById.mockResolvedValue(mockCustomer);
      partyRepository.findById.mockResolvedValue(mockParty);
      customerRepository.getParties.mockResolvedValue([]);

      await expect(useCase.updateParty('1', '1', updateData)).rejects.toThrow(
        BadRequestException,
      );
      expect(customerRepository.updateParty).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when role is invalid', async () => {
      customerRepository.findById.mockResolvedValue(mockCustomer);
      partyRepository.findById.mockResolvedValue(mockParty);
      customerRepository.getParties.mockResolvedValue(['1']);

      const invalidData = { ...updateData, role: 'INVALID_ROLE' as PartyRole };

      await expect(useCase.updateParty('1', '1', invalidData)).rejects.toThrow(
        BadRequestException,
      );
      expect(customerRepository.updateParty).not.toHaveBeenCalled();
    });
  });

  describe('getParties', () => {
    it('should successfully get parties for a customer', async () => {
      customerRepository.findById.mockResolvedValue(mockCustomer);
      customerRepository.getParties.mockResolvedValue(['1', '2']);

      const result = await useCase.getParties('1');

      expect(result).toEqual(['1', '2']);
      expect(customerRepository.getParties).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when customer not found', async () => {
      customerRepository.findById.mockResolvedValue(null);

      await expect(useCase.getParties('1')).rejects.toThrow(NotFoundException);
      expect(customerRepository.getParties).not.toHaveBeenCalled();
    });
  });
});
