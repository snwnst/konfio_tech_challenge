import { IsString, IsEnum, IsOptional } from 'class-validator';
import { CustomerType } from 'src/domain/model/customer-type.model';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Juan Pérez',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'RFC del cliente',
    example: 'XAXX010101000',
    required: false,
  })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiProperty({
    description: 'Tipo de cliente',
    enum: CustomerType,
    example: CustomerType.INDIVIDUAL,
    required: false,
  })
  @IsEnum(CustomerType)
  @IsOptional()
  type?: CustomerType;
}
