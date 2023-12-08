const Joi = require("joi");

module.exports.createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  username: Joi.string().required(),
  phone: Joi.string().required(),
  role: Joi.string().required().valid("JobSeeker", "Employer"),
  avatar: Joi.string().allow(""),
  address: Joi.string().allow(""),
});

module.exports.updateUserSchema = Joi.object({
  name: Joi.string(),
  avatar: Joi.string().allow(""),
  address: Joi.string().allow(""),
});
