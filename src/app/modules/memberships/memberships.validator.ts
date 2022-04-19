import Joi from 'joi';

import { BadRequest } from '../../utils/error';

export const validatePostMembershipRequest = ({ input }) => {
  const schema = Joi.object().keys({
    accountId: Joi.number().required(),
    userId: Joi.number().required(),
  }).required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};