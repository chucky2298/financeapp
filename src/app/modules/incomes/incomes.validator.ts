import Joi from 'joi';

import { BadRequest } from '../../utils/error';

export const validatePostIncomeRequest = ({ input }) => {
  const schema = Joi.object().keys({
    accountId: Joi.number().required(),
    month: Joi.number().required().max(12).min(1),
    year: Joi.number().required().max(2999).min(2022),
    value: Joi.number().required().min(1),
  }).required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};


export const validatePatchIncomeRequest = ({ input }) => {
  const schema = Joi.object()
    .keys({
      value: Joi.number().required().min(1),
    })
    .required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};