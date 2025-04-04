import { ApiProperty } from '@nestjs/swagger';
import { CustomerType } from 'src/domain/model/customer-type.model';

export class ListCustomersDto {
  @ApiProperty({
    description: 'Enterprise type to filter',
    enum: CustomerType,
    example: CustomerType.INDIVIDUAL,
    required: false,
  })
  enterpriseType?: CustomerType;

  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
    minimum: 1,
  })
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
    minimum: 1,
  })
  limit?: number;
}
