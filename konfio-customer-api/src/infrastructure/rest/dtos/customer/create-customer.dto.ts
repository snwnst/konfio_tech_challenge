import { IsString, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { CustomerType } from '../../../../domain/model/customer-type.model';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  taxId: string;

  @IsEnum(CustomerType)
  @IsNotEmpty()
  type: CustomerType;
}
