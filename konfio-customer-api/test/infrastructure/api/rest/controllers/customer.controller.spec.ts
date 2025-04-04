import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '../../../../../src/infrastructure/api/rest/controllers/customer.controller';
import { ListCustomersUseCase } from '../../../../../src/application/use-cases/customer/list-customers.use-case';
import { GetCustomerUseCase } from '../../../../../src/application/use-cases/customer/get-customer.use-case';
import { CreateCustomerUseCase } from '../../../../../src/application/use-cases/customer/create-customer.use-case';
import { UpdateCustomerUseCase } from '../../../../../src/application/use-cases/customer/update-customer.use-case';
import { DeleteCustomerUseCase } from '../../../../../src/application/use-cases/customer/delete-customer.use-case';
import { ManagePartiesUseCase } from '../../../../../src/application/use-cases/customer/manage-parties.use-case';
import { Customer } from '../../../../../src/domain/model/customer.model';
import { CustomerType } from '../../../../../src/domain/model/customer-type.model';
import { PartyRole } from '../../../../../src/domain/model/party-role.model';
import { CreateCustomerDto } from '../../../../../src/infrastructure/api/rest/dtos/customer/create-customer.dto';
import { UpdateCustomerDto } from '../../../../../src/infrastructure/api/rest/dtos/customer/update-customer.dto';
import { ListCustomersDto } from '../../../../../src/infrastructure/api/rest/dtos/customer/list-customers.dto';
import { UpdatePartyDto } from '../../../../../src/infrastructure/api/rest/dtos/party/update-party.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { LoggerPort } from '../../../../../src/application/ports/logger.port';
import { KafkaEventPort } from '../../../../../src/domain/ports/kafka-event.port';
import { CachePort } from '../../../../../src/domain/ports/cache.port';
import { CustomerRepositoryPort } from '../../../../../src/domain/ports/customer.repository.port';
import { PartyRepositoryPort } from '../../../../../src/domain/ports/party.repository.port';

describe('CustomerController', () => {
  let controller: CustomerController;
  let listCustomersUseCase: jest.Mocked<ListCustomersUseCase>;
  let getCustomerUseCase: jest.Mocked<GetCustomerUseCase>;
  let createCustomerUseCase: jest.Mocked<CreateCustomerUseCase>;
  let updateCustomerUseCase: jest.Mocked<UpdateCustomerUseCase>;
  let deleteCustomerUseCase: jest.Mocked<DeleteCustomerUseCase>;
  let managePartiesUseCase: jest.Mocked<ManagePartiesUseCase>;

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

  const mockCustomers = [mockCustomer];

  const mockListResult = {
    customers: mockCustomers,
    total: 1,
  };

  const mockCreateCustomerDto: CreateCustomerDto = {
    name: 'New Customer',
    taxId: 'TAX456',
    type: CustomerType.INDIVIDUAL,
    contactInfo: {
      email: 'new@example.com',
      phone: '9876543210',
      address: '456 New St',
    },
  };

  const mockUpdateCustomerDto: UpdateCustomerDto = {
    name: 'Updated Customer',
    taxId: 'TAX789',
    type: CustomerType.ENTERPRISE,
    contactInfo: {
      id: '1',
      email: 'updated@example.com',
      phone: '1234567890',
      address: '789 Updated St',
    },
  };

  const mockListCustomersDto: ListCustomersDto = {
    enterpriseType: CustomerType.ENTERPRISE,
    page: 1,
    limit: 10,
  };

  const mockUpdatePartyDto: UpdatePartyDto = {
    name: 'Updated Party',
    email: 'party@example.com',
    role: PartyRole.ADMIN,
  };

  beforeEach(async () => {
    // Create mocks with proper typing
    const mockCustomerRepository = {} as jest.Mocked<CustomerRepositoryPort>;
    const mockLogger = {} as jest.Mocked<LoggerPort>;
    const mockKafkaEventPort = {} as jest.Mocked<KafkaEventPort>;
    const mockCachePort = {} as jest.Mocked<CachePort>;
    const mockPartyRepository = {} as jest.Mocked<PartyRepositoryPort>;

    listCustomersUseCase = {
      execute: jest.fn(),
      customerRepository: mockCustomerRepository,
      logger: mockLogger,
      cachePort: mockCachePort,
    } as unknown as jest.Mocked<ListCustomersUseCase>;

    getCustomerUseCase = {
      execute: jest.fn(),
      customerRepository: mockCustomerRepository,
      logger: mockLogger,
      cachePort: mockCachePort,
    } as unknown as jest.Mocked<GetCustomerUseCase>;

    createCustomerUseCase = {
      execute: jest.fn(),
      customerRepository: mockCustomerRepository,
      logger: mockLogger,
      kafkaEventPort: mockKafkaEventPort,
      cachePort: mockCachePort,
    } as unknown as jest.Mocked<CreateCustomerUseCase>;

    updateCustomerUseCase = {
      execute: jest.fn(),
      customerRepository: mockCustomerRepository,
      logger: mockLogger,
      kafkaEventPort: mockKafkaEventPort,
      cachePort: mockCachePort,
    } as unknown as jest.Mocked<UpdateCustomerUseCase>;

    deleteCustomerUseCase = {
      execute: jest.fn(),
      customerRepository: mockCustomerRepository,
      logger: mockLogger,
      kafkaEventPort: mockKafkaEventPort,
      cachePort: mockCachePort,
    } as unknown as jest.Mocked<DeleteCustomerUseCase>;

    managePartiesUseCase = {
      addParty: jest.fn(),
      updateParty: jest.fn(),
      getParties: jest.fn(),
      customerRepository: mockCustomerRepository,
      partyRepository: mockPartyRepository,
      logger: mockLogger,
      kafkaEventPort: mockKafkaEventPort,
      cachePort: mockCachePort,
    } as unknown as jest.Mocked<ManagePartiesUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: ListCustomersUseCase,
          useValue: listCustomersUseCase,
        },
        {
          provide: GetCustomerUseCase,
          useValue: getCustomerUseCase,
        },
        {
          provide: CreateCustomerUseCase,
          useValue: createCustomerUseCase,
        },
        {
          provide: UpdateCustomerUseCase,
          useValue: updateCustomerUseCase,
        },
        {
          provide: DeleteCustomerUseCase,
          useValue: deleteCustomerUseCase,
        },
        {
          provide: ManagePartiesUseCase,
          useValue: managePartiesUseCase,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  describe('listCustomers', () => {
    it('should return a list of customers', async () => {
      listCustomersUseCase.execute.mockResolvedValue(mockListResult);

      const result = await controller.listCustomers(mockListCustomersDto);

      expect(result).toEqual(mockListResult);
      expect(listCustomersUseCase.execute).toHaveBeenCalledWith({
        enterpriseType: mockListCustomersDto.enterpriseType,
        page: mockListCustomersDto.page,
        limit: mockListCustomersDto.limit,
      });
    });

    it('should handle errors when listing customers', async () => {
      const error = new Error('Database error');
      listCustomersUseCase.execute.mockRejectedValue(error);

      await expect(
        controller.listCustomers(mockListCustomersDto),
      ).rejects.toThrow(error);
    });
  });

  describe('getCustomer', () => {
    it('should return a customer by ID', async () => {
      getCustomerUseCase.execute.mockResolvedValue(mockCustomer);

      const result = await controller.getCustomer('1');

      expect(result).toEqual(mockCustomer);
      expect(getCustomerUseCase.execute).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when customer not found', async () => {
      getCustomerUseCase.execute.mockRejectedValue(
        new NotFoundException('Customer not found'),
      );

      await expect(controller.getCustomer('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      createCustomerUseCase.execute.mockResolvedValue(mockCustomer);

      const result = await controller.createCustomer(mockCreateCustomerDto);

      expect(result).toEqual(mockCustomer);
      expect(createCustomerUseCase.execute).toHaveBeenCalledWith(
        mockCreateCustomerDto,
      );
    });

    it('should handle validation errors when creating a customer', async () => {
      const error = new BadRequestException('Invalid data');
      createCustomerUseCase.execute.mockRejectedValue(error);

      await expect(
        controller.createCustomer(mockCreateCustomerDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer', async () => {
      updateCustomerUseCase.execute.mockResolvedValue(mockCustomer);

      const result = await controller.updateCustomer(
        '1',
        mockUpdateCustomerDto,
      );

      expect(result).toEqual(mockCustomer);
      expect(updateCustomerUseCase.execute).toHaveBeenCalledWith(
        '1',
        mockUpdateCustomerDto,
      );
    });

    it('should throw NotFoundException when customer not found', async () => {
      updateCustomerUseCase.execute.mockRejectedValue(
        new NotFoundException('Customer not found'),
      );

      await expect(
        controller.updateCustomer('1', mockUpdateCustomerDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer', async () => {
      deleteCustomerUseCase.execute.mockResolvedValue(undefined);

      await controller.deleteCustomer('1');

      expect(deleteCustomerUseCase.execute).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when customer not found', async () => {
      deleteCustomerUseCase.execute.mockRejectedValue(
        new NotFoundException('Customer not found'),
      );

      await expect(controller.deleteCustomer('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addParty', () => {
    it('should add a party to a customer', async () => {
      managePartiesUseCase.addParty.mockResolvedValue(undefined);

      await controller.addParty('1', '1');

      expect(managePartiesUseCase.addParty).toHaveBeenCalledWith('1', '1');
    });

    it('should throw NotFoundException when customer or party not found', async () => {
      managePartiesUseCase.addParty.mockRejectedValue(
        new NotFoundException('Customer or party not found'),
      );

      await expect(controller.addParty('1', '1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateParty', () => {
    it('should update a party of a customer', async () => {
      managePartiesUseCase.updateParty.mockResolvedValue(undefined);

      await controller.updateParty('1', '1', mockUpdatePartyDto);

      expect(managePartiesUseCase.updateParty).toHaveBeenCalledWith(
        '1',
        '1',
        mockUpdatePartyDto,
      );
    });

    it('should throw NotFoundException when customer or party not found', async () => {
      managePartiesUseCase.updateParty.mockRejectedValue(
        new NotFoundException('Customer or party not found'),
      );

      await expect(
        controller.updateParty('1', '1', mockUpdatePartyDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getParties', () => {
    it('should get parties of a customer', async () => {
      const mockParties = ['1', '2'];
      managePartiesUseCase.getParties.mockResolvedValue(mockParties);

      const result = await controller.getParties('1');

      expect(result).toEqual(mockParties);
      expect(managePartiesUseCase.getParties).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when customer not found', async () => {
      managePartiesUseCase.getParties.mockRejectedValue(
        new NotFoundException('Customer not found'),
      );

      await expect(controller.getParties('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
