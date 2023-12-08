const { createEmployerSchema, updateEmployerSchema } = require("../../schemas/employer");
const HttpException = require("../../utils/HttpException");

module.exports.validateCreateEmployer = (req, res, next) => {
  const { error } = createEmployerSchema.validate(req.body);
  if (error) {
    throw new HttpException(500, error.message);
  }
  next();
};

module.exports.validateUpdateEmployer = (req, res, next) => {
  const { error } = updateEmployerSchema.validate(req.body);
  if (error) {
    throw new HttpException(500, error.message);
  }
  next();
};
