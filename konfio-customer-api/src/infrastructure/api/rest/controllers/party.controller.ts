import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { GetPartyCustomersUseCase } from 'src/application/use-cases/party/get-party-customers.use-case';
import { CreatePartyUseCase } from 'src/application/use-cases/party/create-party.use-case';
import { DeletePartyUseCase } from 'src/application/use-cases/party/delete-party.use-case';
import { UpdatePartyUseCase } from 'src/application/use-cases/party/update-party.use-case';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CreatePartyDto } from '../dtos/party/create-party.dto';
import { UpdatePartyDto } from '../dtos/party/update-party.dto';
import { JoiValidationPipe } from '../pipes/joi-validation.pipe';
import { createPartySchema } from '../schemas/create-party.schema';
import { updatePartySchema } from '../schemas/update-party.schema';

@ApiTags('parties')
@Controller('parties')
export class PartyController {
  constructor(
    private readonly getPartyCustomersUseCase: GetPartyCustomersUseCase,
    private readonly createPartyUseCase: CreatePartyUseCase,
    private readonly deletePartyUseCase: DeletePartyUseCase,
    private readonly updatePartyUseCase: UpdatePartyUseCase,
  ) {}

  @Get(':partyId/customers')
  @ApiOperation({ summary: 'Get customers associated with a party' })
  @ApiParam({
    name: 'partyId',
    description: 'Party ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Party not found' })
  async getPartyCustomers(@Param('partyId') partyId: string) {
    return this.getPartyCustomersUseCase.execute(partyId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new party' })
  @ApiBody({ type: CreatePartyDto })
  @ApiResponse({
    status: 201,
    description: 'Party created successfully',
    type: CreatePartyDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @UsePipes(new JoiValidationPipe(createPartySchema))
  async createParty(@Body() createPartyDto: CreatePartyDto) {
    return this.createPartyUseCase.execute(createPartyDto);
  }

  @Delete(':partyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a party' })
  @ApiParam({
    name: 'partyId',
    description: 'Party ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 204, description: 'Party deleted successfully' })
  @ApiResponse({ status: 404, description: 'Party not found' })
  async deleteParty(@Param('partyId') partyId: string) {
    await this.deletePartyUseCase.execute(partyId);
  }

  @Put(':partyId')
  @ApiOperation({ summary: 'Update a party' })
  @ApiParam({
    name: 'partyId',
    description: 'Party ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdatePartyDto })
  @ApiResponse({
    status: 200,
    description: 'Party updated successfully',
    type: UpdatePartyDto,
  })
  @ApiResponse({ status: 404, description: 'Party not found' })
  @UsePipes(new JoiValidationPipe(updatePartySchema))
  async updateParty(
    @Param('partyId') partyId: string,
    @Body() updatePartyDto: UpdatePartyDto,
  ) {
    return this.updatePartyUseCase.execute(partyId, updatePartyDto);
  }
}
