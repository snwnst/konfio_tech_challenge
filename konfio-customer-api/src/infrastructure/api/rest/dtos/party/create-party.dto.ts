import { IsString, IsEnum, IsEmail, IsNotEmpty } from 'class-validator';
import { PartyRole } from 'src/domain/model/party-role.model';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePartyDto {
  @ApiProperty({
    description: 'Name of the party',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email address of the party',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Role of the party',
    enum: PartyRole,
    example: PartyRole.ADMIN,
  })
  @IsEnum(PartyRole)
  @IsNotEmpty()
  role: PartyRole;

  @ApiProperty({
    description: 'ID of the customer this party belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  customerId: string;
}
