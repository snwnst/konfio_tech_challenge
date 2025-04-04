import { IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { CustomerType } from 'src/domain/model/customer-type.model';
import { ApiProperty } from '@nestjs/swagger';

export class ListCustomersDto {
  @ApiProperty({
    description: 'Tipo de empresa para filtrar',
    enum: CustomerType,
    example: CustomerType.INDIVIDUAL,
    required: false,
  })
  @IsEnum(CustomerType)
  @IsOptional()
  enterpriseType?: CustomerType;

  @ApiProperty({
    description: 'Número de página',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'Número de elementos por página',
    example: 10,
    required: false,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;
}
