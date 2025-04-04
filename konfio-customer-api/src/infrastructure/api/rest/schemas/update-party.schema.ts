import * as Joi from 'joi';
import { PartyRole } from 'src/domain/model/party-role.model';

export const updatePartySchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.empty': 'Name cannot be empty',
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email cannot be empty',
  }),
  role: Joi.string()
    .valid(...Object.values(PartyRole))
    .optional()
    .messages({
      'any.only': 'Role must be one of: ADMIN, EMPLOYEE, READ_ONLY',
    }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });
