import { IsString, IsEnum, IsOptional } from 'class-validator';
import { PartyRole } from '../../../../domain/model/party-role.model';

export class UpdatePartyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsEnum(PartyRole)
  @IsOptional()
  role?: PartyRole;
}
