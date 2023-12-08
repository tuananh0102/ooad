const { loginSchema, sendRequestResetPasswordSchema } = require("../../schemas/auth");
const HttpException = require("../../utils/HttpException");

module.exports.validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    throw new HttpException(500, error.message);
  }
  next();
};

module.exports.validateSendRequestResetPassword = (req, res, next) => {
  const { error } = sendRequestResetPasswordSchema.validate(req.body);
  if (error) {
    throw new HttpException(500, error.message);
  }
  next();
};
