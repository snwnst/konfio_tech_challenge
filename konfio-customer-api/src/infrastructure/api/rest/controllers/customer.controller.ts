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

@ApiTags('customers')
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
  @ApiOperation({ summary: 'Listar clientes' })
  @ApiQuery({ name: 'enterpriseType', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes obtenida exitosamente',
  })
  async listCustomers(@Query() query: ListCustomersDto) {
    return this.listCustomersUseCase.execute({
      enterpriseType: query.enterpriseType,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async getCustomer(@Param('id') id: string) {
    return this.getCustomerUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.createCustomerUseCase.execute(createCustomerDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.updateCustomerUseCase.execute(id, updateCustomerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 204, description: 'Cliente eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async deleteCustomer(@Param('id') id: string) {
    await this.deleteCustomerUseCase.execute(id);
  }

  @Post(':id/parties/:partyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Agregar una parte a un cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiParam({ name: 'partyId', description: 'ID de la parte' })
  @ApiResponse({ status: 204, description: 'Parte agregada exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente o parte no encontrado' })
  async addParty(
    @Param('id') customerId: string,
    @Param('partyId') partyId: string,
  ) {
    await this.managePartiesUseCase.addParty(customerId, partyId);
  }

  @Put(':id/parties/:partyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Actualizar una parte de un cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiParam({ name: 'partyId', description: 'ID de la parte' })
  @ApiResponse({ status: 204, description: 'Parte actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente o parte no encontrado' })
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
  @ApiOperation({ summary: 'Obtener las partes de un cliente' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({ status: 200, description: 'Partes obtenidas exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async getParties(@Param('id') customerId: string) {
    return this.managePartiesUseCase.getParties(customerId);
  }
}
