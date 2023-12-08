const Joi = require("joi");

module.exports.createEducationSchema = Joi.object({
  school: Joi.string().required(),
  degree: Joi.string().required(),
  major: Joi.string().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  description: Joi.string().allow(""),
});

module.exports.updateEducationSchema = Joi.object({
  school: Joi.string().required(),
  degree: Joi.string().required(),
  major: Joi.string().required(),
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  description: Joi.string().allow(""),
});
