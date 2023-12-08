const { createEducationSchema, updateEducationSchema } = require("../../schemas/education");
const HttpException = require("../../utils/HttpException");

module.exports.validateCreateEducation = (req, res, next) => {
  const { error } = createEducationSchema.validate(req.body);
  if (error) {
    throw new HttpException(500, error.message);
  }
  next();
};

module.exports.validateUpdateEducation = (req, res, next) => {
  const { error } = updateEducationSchema.validate(req.body);
  if (error) {
    throw new HttpException(500, error.message);
  }
  next();
};
