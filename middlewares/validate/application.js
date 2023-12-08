const { updateApplicationSchema } = require("../../schemas/application");
const HttpException = require("../../utils/HttpException");

module.exports.validateUpdateApplication = (req, res, next) => {
  const { error } = updateApplicationSchema.validate(req.body);
  if (error) {
    throw new HttpException(500, error.message);
  }
  next();
};
