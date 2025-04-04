import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ListCustomersUseCase } from '../../../application/use-cases/customer/list-customers.use-case';
import { GetCustomerUseCase } from '../../../application/use-cases/customer/get-customer.use-case';
import { CreateCustomerUseCase } from '../../../application/use-cases/customer/create-customer.use-case';
import { UpdateCustomerUseCase } from '../../../application/use-cases/customer/update-customer.use-case';
import { DeleteCustomerUseCase } from '../../../application/use-cases/customer/delete-customer.use-case';
import { ManagePartiesUseCase } from '../../../application/use-cases/customer/manage-parties.use-case';
import { CreateCustomerDto } from '../dtos/customer/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/customer/update-customer.dto';
import { ListCustomersDto } from '../dtos/customer/list-customers.dto';
import { UpdatePartyDto } from '../dtos/party/update-party.dto';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly listCustomersUseCase: ListCustomersUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
    private readonly managePartiesUseCase: ManagePartiesUseCase,
  ) {}

  @Get()
  async listCustomers(@Query() query: ListCustomersDto) {
    return this.listCustomersUseCase.execute({
      enterpriseType: query.enterpriseType,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  async getCustomer(@Param('id') id: string) {
    return this.getCustomerUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.createCustomerUseCase.execute(createCustomerDto);
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.updateCustomerUseCase.execute(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCustomer(@Param('id') id: string) {
    await this.deleteCustomerUseCase.execute(id);
  }

  @Post(':id/parties/:partyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addParty(
    @Param('id') customerId: string,
    @Param('partyId') partyId: string,
  ) {
    await this.managePartiesUseCase.addParty(customerId, partyId);
  }

  @Put(':id/parties/:partyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateParty(
    @Param('id') customerId: string,
    @Param('partyId') partyId: string,
    @Body() updatePartyDto: UpdatePartyDto,
  ) {
    await this.managePartiesUseCase.updateParty(
      customerId,
      partyId,
      updatePartyDto,
    );
  }

  @Get(':id/parties')
  async getParties(@Param('id') customerId: string) {
    return this.managePartiesUseCase.getParties(customerId);
  }
}
