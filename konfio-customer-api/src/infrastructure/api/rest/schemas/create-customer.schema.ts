import * as Joi from 'joi';
import { CustomerType } from 'src/domain/model/customer-type.model';

export const createCustomerSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  taxId: Joi.string().required().messages({
    'string.empty': 'Tax ID is required',
    'any.required': 'Tax ID is required',
  }),
  type: Joi.string()
    .valid(...Object.values(CustomerType))
    .required()
    .messages({
      'any.only':
        'Customer type must be one of: ' +
        Object.values(CustomerType).join(', '),
      'any.required': 'Customer type is required',
    }),
  contactInfo: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Contact email must be valid',
      'string.empty': 'Contact email is required',
      'any.required': 'Contact email is required',
    }),
    phone: Joi.string().required().messages({
      'string.empty': 'Contact phone is required',
      'any.required': 'Contact phone is required',
    }),
    address: Joi.string().required().messages({
      'string.empty': 'Contact address is required',
      'any.required': 'Contact address is required',
    }),
  })
    .required()
    .messages({
      'any.required': 'Contact info is required',
    }),
});
