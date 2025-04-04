import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { CustomerType } from 'src/domain/model/customer-type.model';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Juan Pérez',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'RFC del cliente',
    example: 'XAXX010101000',
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  taxId: string;

  @ApiProperty({
    description: 'Tipo de cliente',
    enum: CustomerType,
    example: CustomerType.INDIVIDUAL,
  })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEnum(CustomerType)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  type: CustomerType;
}
