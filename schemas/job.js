const Joi = require("joi");
const gender = require("../constants/gender");
const typeOfWorking = require("../constants/typeOfWorking");

module.exports.createJobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  requirements: Joi.string().required(),
  tags: Joi.string(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  salary: Joi.number().required(),
  typeOfWorking: Joi.string()
    .required()
    .valid(...Object.values(typeOfWorking)),
  gender: Joi.string().valid(...Object.values(gender)),
  positions: Joi.string().required(),
  slots: Joi.number().required(),
  exp: Joi.string().required(),
  benefits: Joi.string().required(),
  imageUrl: Joi.string(),
});

module.exports.updateJobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  requirements: Joi.string().required(),
  tags: Joi.string(),
  startTime: Joi.date().required(),
  endTime: Joi.date().required(),
  salary: Joi.number().required(),
  typeOfWorking: Joi.string()
    .required()
    .valid(...Object.values(typeOfWorking)),
  gender: Joi.string().valid(...Object.values(gender)),
  positions: Joi.string().required(),
  slots: Joi.number().required(),
  exp: Joi.string().required(),
  benefits: Joi.string().required(),
  imageUrl: Joi.string(),
});
