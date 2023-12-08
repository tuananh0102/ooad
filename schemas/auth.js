const Joi = require("joi");

module.exports.loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports.sendRequestResetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports.updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});
