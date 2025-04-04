import { Controller, Get, Param } from '@nestjs/common';
import { GetPartyCustomersUseCase } from 'src/application/use-cases/party/get-party-customers.use-case';

@Controller('parties')
export class PartyController {
  constructor(
    private readonly getPartyCustomersUseCase: GetPartyCustomersUseCase,
  ) {}

  @Get(':partyId/customers')
  async getPartyCustomers(@Param('partyId') partyId: string) {
    return this.getPartyCustomersUseCase.execute(partyId);
  }
}
