const Joi = require("joi");

module.exports.createEmployerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  username: Joi.string().required(),
  phone: Joi.string().required(),
  avatar: Joi.string().allow(""),
  address: Joi.string().allow(""),
  about: Joi.string().allow(""),
  wallpaper: Joi.string().allow(""),
  size: Joi.number().allow(""),
});

module.exports.updateEmployerSchema = Joi.object({
  about: Joi.string().allow(""),
  wallpaper: Joi.string().allow(""),
  size: Joi.number().allow(""),
});
