import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { CustomerType } from 'src/domain/model/customer-type.model';

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
