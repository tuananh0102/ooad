const Joi = require("joi");

module.exports.createCommentSchema = Joi.object({
  content: Joi.string().required(),
});

module.exports.updateCommentSchema = Joi.object({
  content: Joi.string().required(),
});
