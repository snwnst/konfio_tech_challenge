import { IsString, IsEnum, IsOptional } from 'class-validator';
import { CustomerType } from '../../../../domain/model/customer-type.model';

export class UpdateCustomerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsEnum(CustomerType)
  @IsOptional()
  type?: CustomerType;
}
