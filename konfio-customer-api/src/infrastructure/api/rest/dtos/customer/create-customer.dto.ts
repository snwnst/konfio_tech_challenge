import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsString, IsEmail, IsEnum } from 'class-validator';
import { CustomerType } from 'src/domain/model/customer-type.model';

class ContactInfoDto {
  @ApiProperty({
    description: 'Contact info email',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Contact info phone', example: '+1234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Contact info address', example: '123 Main St' })
  @IsString()
  address: string;
}

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Customer tax ID',
    example: 'XAXX010101000',
    required: true,
    minLength: 10,
  })
  @IsString()
  taxId: string;

  @ApiProperty({
    description: 'Customer type',
    enum: CustomerType,
    example: CustomerType.INDIVIDUAL,
    required: true,
  })
  @IsEnum(CustomerType)
  type: CustomerType;

  @ApiProperty({ description: 'Customer contact info', type: ContactInfoDto })
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;
}
