import { IsString, IsEnum, IsOptional } from 'class-validator';
import { CustomerType } from 'src/domain/model/customer-type.model';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Juan Pérez',
    required: false,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'RFC del cliente',
    example: 'XAXX010101000',
    required: false,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  taxId?: string;

  @ApiProperty({
    description: 'Tipo de cliente',
    enum: CustomerType,
    example: CustomerType.INDIVIDUAL,
    required: false,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEnum(CustomerType)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsOptional()
  type?: CustomerType;
}
