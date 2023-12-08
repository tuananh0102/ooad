const { createJobseekerSchema, updateJobseekerSchema } = require("../../schemas/jobseeker");
const HttpException = require("../../utils/HttpException");

module.exports.validateCreateJobseeker = (req, res, next) => {
  const { error } = createJobseekerSchema.validate(req.body);
  if (error) {
    throw new HttpException(500, error.message);
  }
  next();
};

module.exports.validateUpdateJobseeker = (req, res, next) => {
  const { error } = updateJobseekerSchema.validate(req.body);
  if (error) {
    throw new HttpException(500, error.message);
  }
  next();
};
