import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { CustomerType } from 'src/domain/model/customer-type.model';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'RFC del cliente',
    example: 'XAXX010101000',
  })
  @IsString()
  @IsNotEmpty()
  taxId: string;

  @ApiProperty({
    description: 'Tipo de cliente',
    enum: CustomerType,
    example: CustomerType.INDIVIDUAL,
  })
  @IsEnum(CustomerType)
  @IsNotEmpty()
  type: CustomerType;
}
