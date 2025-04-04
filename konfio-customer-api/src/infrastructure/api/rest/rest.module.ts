import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';
import { PartyController } from './controllers/party.controller';
import { PersistenceModule } from 'src/infrastructure/persistence/persistence.module';
import { ListCustomersUseCase } from 'src/application/use-cases/customer/list-customers.use-case';
import { GetCustomerUseCase } from 'src/application/use-cases/customer/get-customer.use-case';
import { CreateCustomerUseCase } from 'src/application/use-cases/customer/create-customer.use-case';
import { UpdateCustomerUseCase } from 'src/application/use-cases/customer/update-customer.use-case';
import { DeleteCustomerUseCase } from 'src/application/use-cases/customer/delete-customer.use-case';
import { ManagePartiesUseCase } from 'src/application/use-cases/customer/manage-parties.use-case';
import { GetPartyCustomersUseCase } from 'src/application/use-cases/party/get-party-customers.use-case';
import { CreatePartyUseCase } from 'src/application/use-cases/party/create-party.use-case';
import { UpdatePartyUseCase } from 'src/application/use-cases/party/update-party.use-case';
import { LoggerModule } from 'src/infrastructure/logger/logger.module';
import { EventsModule } from 'src/infrastructure/events/events.module';
import { CacheModule } from 'src/infrastructure/cache/cache.module';
import { DeletePartyUseCase } from 'src/application/use-cases/party/delete-party.use-case';

@Module({
  imports: [PersistenceModule, LoggerModule, EventsModule, CacheModule],
  controllers: [CustomerController, PartyController],
  providers: [
    ListCustomersUseCase,
    GetCustomerUseCase,
    CreateCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    ManagePartiesUseCase,
    GetPartyCustomersUseCase,
    CreatePartyUseCase,
    UpdatePartyUseCase,
    DeletePartyUseCase,
  ],
})
export class RestModule {}
