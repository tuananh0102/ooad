const Joi = require("joi");
const gender = require("../constants/gender");

module.exports.createJobseekerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  username: Joi.string().required(),
  phone: Joi.string().required(),
  avatar: Joi.string().allow(""),
  address: Joi.string().allow(""),
  age: Joi.number().required(),
  gender: Joi.string().valid(...Object.values(gender)),
  experience: Joi.string().allow(""),
  advanedSkill: Joi.string().allow(""),
  salary: Joi.number().min(0).required(),
  workplace: Joi.string().allow(""),
  cv: Joi.string().allow(""),
  careerFeild: Joi.string().allow(""),
  typeOfJob: Joi.string().allow(""),
});

module.exports.updateJobseekerSchema = Joi.object({
  age: Joi.number().required(),
  gender: Joi.string().valid(...Object.values(gender)),
  experience: Joi.string().allow(""),
  advanedSkill: Joi.string().allow(""),
  salary: Joi.number().min(0),
  workplace: Joi.string().allow(""),
  cv: Joi.string().allow(""),
  careerFeild: Joi.string().allow(""),
  typeOfJob: Joi.string().allow(""),
});
