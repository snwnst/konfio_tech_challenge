import { ApiProperty } from '@nestjs/swagger';
import { CustomerType } from 'src/domain/model/customer-type.model';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Customer tax ID',
    example: 'XAXX010101000',
  })
  taxId: string;

  @ApiProperty({
    description: 'Customer type',
    enum: CustomerType,
    example: CustomerType.INDIVIDUAL,
  })
  type: CustomerType;
}
