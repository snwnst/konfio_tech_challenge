import { ApiProperty } from '@nestjs/swagger';
import { CustomerType } from 'src/domain/model/customer-type.model';

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Customer tax ID',
    example: 'XAXX010101000',
    required: false,
  })
  taxId?: string;

  @ApiProperty({
    description: 'Customer type',
    enum: CustomerType,
    example: CustomerType.INDIVIDUAL,
    required: false,
  })
  type?: CustomerType;

  @ApiProperty({
    description: 'Customer email',
    example: 'john.doe@example.com',
    required: false,
  })
  email?: string;
}
