import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CustomerType } from 'src/domain/model/customer-type.model';

class UpdateContactInfoDto {
  @ApiProperty({
    description: 'Contact info ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  id: string;

  @ApiProperty({
    description: 'Contact info email',
    example: 'john.doe@example.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    description: 'Contact info phone',
    example: '+1234567890',
    required: true,
  })
  phone: string;

  @ApiProperty({
    description: 'Contact info address',
    example: '123 Main St',
    required: true,
  })
  address: string;
}

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    required: true,
  })
  name?: string;

  @ApiProperty({
    description: 'Customer tax ID',
    example: 'XAXX010101000',
    required: true,
  })
  taxId?: string;

  @ApiProperty({
    description: 'Customer type',
    enum: CustomerType,
    example: CustomerType.INDIVIDUAL,
    required: true,
  })
  type?: CustomerType;

  @ApiProperty({
    description: 'Customer contact info',
    type: UpdateContactInfoDto,
    required: true,
  })
  @Type(() => UpdateContactInfoDto)
  contactInfo: UpdateContactInfoDto;
}
