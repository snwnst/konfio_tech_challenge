import * as Joi from 'joi';
import { CustomerType } from 'src/domain/model/customer-type.model';

export const updateCustomerSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.empty': 'Name cannot be empty',
  }),
  taxId: Joi.string().optional().messages({
    'string.empty': 'Tax ID cannot be empty',
  }),
  type: Joi.string()
    .valid(...Object.values(CustomerType))
    .optional()
    .messages({
      'any.only':
        'Customer type must be one of: ' +
        Object.values(CustomerType).join(', '),
    }),
});
