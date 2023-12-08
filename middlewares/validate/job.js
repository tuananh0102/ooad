const { createJobSchema, updateJobSchema } = require("../../schemas/job");
const HttpException = require("../../utils/HttpException");

const PublishJobForm = require("../../form/PublishJobForm");

module.exports.validateCreateJob = (req, res, next) => {
  const {
    title,
    description,
    requirements,
    tags,
    startTime,
    endTime,
    salary,
    typeOfWorking,
    gender,
    positions,
    slots,
    exp,
    benefits,
    imageUrl,
  } = req.body;

  const publishJobForm = new PublishJobForm(
    title,
    description,
    requirements,
    tags,
    startTime,
    endTime,
    salary,
    typeOfWorking,
    gender,
    positions,
    slots,
    exp,
    benefits,
    imageUrl
  );

  if (!publishJobForm.validate()) {
    throw new HttpException(500, error.message);
  }
  next();
};

module.exports.validateUpdateJob = (req, res, next) => {
  const { error } = updateJobSchema.validate(req.body);
  if (error) {
    throw new HttpException(500, error.message);
  }
  next();
};
