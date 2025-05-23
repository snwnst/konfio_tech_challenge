import { IsString, IsEnum, IsOptional } from 'class-validator';
import { PartyRole } from 'src/domain/model/party-role.model';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePartyDto {
  @ApiProperty({
    description: 'Name of the party',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Email address of the party',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Role of the party',
    enum: PartyRole,
    example: PartyRole.ADMIN,
    required: false,
  })
  @IsEnum(PartyRole)
  @IsOptional()
  role?: PartyRole;
}
