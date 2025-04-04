import { Controller, Get, Param } from '@nestjs/common';
import { GetPartyCustomersUseCase } from 'src/application/use-cases/party/get-party-customers.use-case';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('parties')
@Controller('parties')
export class PartyController {
  constructor(
    private readonly getPartyCustomersUseCase: GetPartyCustomersUseCase,
  ) {}

  @Get(':partyId/customers')
  @ApiOperation({ summary: 'Obtener los clientes asociados a una parte' })
  @ApiParam({ name: 'partyId', description: 'ID de la parte' })
  @ApiResponse({ status: 200, description: 'Clientes obtenidos exitosamente' })
  @ApiResponse({ status: 404, description: 'Parte no encontrada' })
  async getPartyCustomers(@Param('partyId') partyId: string) {
    return this.getPartyCustomersUseCase.execute(partyId);
  }
}
