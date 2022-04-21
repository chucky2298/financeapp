import Joi from "joi";

import { BadRequest } from "../../utils/error";

export const validatePostExpenseRequest = ({ input }) => {
  const schema = Joi.object()
    .keys({
      accountId: Joi.number().required(),
      month: Joi.number().required().max(12).min(1),
      year: Joi.number().required().max(2999).min(2022),
      value: Joi.number().required().min(1),
      description: Joi.string(),
      category: Joi.string()
        .required()
        .valid(
          "HOUSE",
          "PERSONAL",
          "FOOD",
          "TRANSPORT",
          "HEALTH",
          "ENTERTAINMENT"
        ),
    })
    .required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};

export const validatePatchExpenseRequest = ({ input }) => {
  const schema = Joi.object()
    .keys({
      value: Joi.number().required().min(1),
      description: Joi.string(),
      category: Joi.string().required(),
    })
    .required();

  const result = schema.validate(input);

  if (result.error) {
    throw new BadRequest(result?.error?.details);
  }
};
