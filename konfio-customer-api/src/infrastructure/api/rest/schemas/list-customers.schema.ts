import * as Joi from 'joi';
import { CustomerType } from 'src/domain/model/customer-type.model';

export const listCustomersSchema = Joi.object({
  enterpriseType: Joi.string()
    .valid(...Object.values(CustomerType))
    .optional()
    .messages({
      'any.only':
        'Enterprise type must be one of: ' +
        Object.values(CustomerType).join(', '),
    }),
  page: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be greater than or equal to 1',
  }),
  limit: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be greater than or equal to 1',
  }),
});
