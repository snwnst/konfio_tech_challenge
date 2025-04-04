import * as Joi from 'joi';
import { PartyRole } from 'src/domain/model/party-role.model';

export const createPartySchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  role: Joi.string()
    .valid(...Object.values(PartyRole))
    .required()
    .messages({
      'any.only': 'Role must be one of: ADMIN, EMPLOYEE, READ_ONLY',
      'any.required': 'Role is required',
    }),
  customerId: Joi.string().required().messages({
    'string.empty': 'Customer ID is required',
    'any.required': 'Customer ID is required',
  }),
});
