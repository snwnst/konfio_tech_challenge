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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEnum(CustomerType)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  enterpriseType?: CustomerType;

  @ApiProperty({
    description: 'Número de página',
    example: 1,
    required: false,
    minimum: 1,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsInt()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Min(1)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'Número de elementos por página',
    example: 10,
    required: false,
    minimum: 1,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsInt()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Min(1)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  limit?: number;
}
