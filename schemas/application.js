const Joi = require("joi");
const applicationStatus = require("../constants/application");

module.exports.updateApplicationSchema = Joi.object({
  status: Joi.string()
    .required()
    .valid(...Object.values(applicationStatus)),
});
