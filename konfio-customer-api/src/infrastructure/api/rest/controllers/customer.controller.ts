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
  UsePipes,
} from '@nestjs/common';
import { DeleteCustomerUseCase } from 'src/application/use-cases/customer/delete-customer.use-case';
import { UpdateCustomerDto } from '../dtos/customer/update-customer.dto';
import { ListCustomersDto } from '../dtos/customer/list-customers.dto';
import { UpdatePartyDto } from '../dtos/party/update-party.dto';
import { ListCustomersUseCase } from 'src/application/use-cases/customer/list-customers.use-case';
import { GetCustomerUseCase } from 'src/application/use-cases/customer/get-customer.use-case';
import { CreateCustomerUseCase } from 'src/application/use-cases/customer/create-customer.use-case';
import { ManagePartiesUseCase } from 'src/application/use-cases/customer/manage-parties.use-case';
import { UpdateCustomerUseCase } from 'src/application/use-cases/customer/update-customer.use-case';
import { CreateCustomerDto } from '../dtos/customer/create-customer.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';
import { createCustomerSchema } from '../schemas/create-customer.schema';
import { updateCustomerSchema } from '../schemas/update-customer.schema';
import { listCustomersSchema } from '../schemas/list-customers.schema';

@ApiTags('enterprises')
@Controller('enterprises')
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
  @ApiOperation({ summary: 'List customers' })
  @ApiQuery({ name: 'enterpriseType', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({
    status: 200,
    description: 'Customers list retrieved successfully',
  })
  @UsePipes(new JoiValidationPipe(listCustomersSchema))
  async listCustomers(@Query() query: ListCustomersDto) {
    return this.listCustomersUseCase.execute({
      enterpriseType: query.enterpriseType,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer found' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getCustomer(@Param('id') id: string) {
    return this.getCustomerUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @UsePipes(new JoiValidationPipe(createCustomerSchema))
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.createCustomerUseCase.execute(createCustomerDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @UsePipes(new JoiValidationPipe(updateCustomerSchema))
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.updateCustomerUseCase.execute(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 204, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async deleteCustomer(@Param('id') id: string) {
    await this.deleteCustomerUseCase.execute(id);
  }

  @Post(':id/parties/:partyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Add a party to a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiParam({ name: 'partyId', description: 'Party ID' })
  @ApiResponse({ status: 204, description: 'Party added successfully' })
  @ApiResponse({ status: 404, description: 'Customer or party not found' })
  async addParty(
    @Param('id') customerId: string,
    @Param('partyId') partyId: string,
  ) {
    await this.managePartiesUseCase.addParty(customerId, partyId);
  }

  @Put(':id/parties/:partyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update a party of a customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiParam({ name: 'partyId', description: 'Party ID' })
  @ApiResponse({ status: 204, description: 'Party updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer or party not found' })
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
  @ApiOperation({ summary: 'Get customer parties' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Parties retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getParties(@Param('id') customerId: string) {
    return this.managePartiesUseCase.getParties(customerId);
  }
}
