import { IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { CustomerType } from 'src/domain/model/customer-type.model';

export class ListCustomersDto {
  @IsEnum(CustomerType)
  @IsOptional()
  enterpriseType?: CustomerType;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;
}
