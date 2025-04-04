import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';
import { PartyController } from './controllers/party.controller';
import { ListCustomersUseCase } from '../../application/use-cases/customer/list-customers.use-case';
import { GetCustomerUseCase } from '../../application/use-cases/customer/get-customer.use-case';
import { CreateCustomerUseCase } from '../../application/use-cases/customer/create-customer.use-case';
import { UpdateCustomerUseCase } from '../../application/use-cases/customer/update-customer.use-case';
import { DeleteCustomerUseCase } from '../../application/use-cases/customer/delete-customer.use-case';
import { ManagePartiesUseCase } from '../../application/use-cases/customer/manage-parties.use-case';
import { GetPartyCustomersUseCase } from '../../application/use-cases/party/get-party-customers.use-case';
import { PersistenceModule } from '../persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [CustomerController, PartyController],
  providers: [
    ListCustomersUseCase,
    GetCustomerUseCase,
    CreateCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    ManagePartiesUseCase,
    GetPartyCustomersUseCase,
  ],
})
export class RestModule {}
