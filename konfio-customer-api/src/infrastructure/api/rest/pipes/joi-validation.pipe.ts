import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.ObjectSchema) {}

  transform(value: any): any {
    const { error } = this.schema.validate(value, { abortEarly: false });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      throw new BadRequestException(errorMessage);
    }

    return value;
  }
}
