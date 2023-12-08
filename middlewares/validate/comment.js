const { createCommentSchema, updateCommentSchema } = require("../../schemas/comment");
const HttpException = require("../../utils/HttpException");

module.exports.validateCreateComment = (req, res, next) => {
  const { error } = createCommentSchema.validate(req.body);
  if (error) {
    throw new HttpException(500, error.message);
  }
  next();
};

module.exports.validateUpdateComment = (req, res, next) => {
  const { error } = updateCommentSchema.validate(req.body);
  if (error) {
    throw new HttpException(500, error.message);
  }
  next();
};
