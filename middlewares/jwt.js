const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const CommentModel = require("../models/comment");
const JobModel = require("../models/job");
const ApplicationModel = require("../models/application");
const EducationModel = require("../models/education");
const HttpException = require("../utils/HttpException");
const Role = require("../constants/user");

module.exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearer = "Bearer ";

    if (!authHeader || !authHeader.startsWith(bearer)) {
      throw new HttpException(401, "Access denied. No credentials sent!");
    }

    const token = authHeader.replace(bearer, "");
    const secretKey = process.env.JWT_ACCESS_KEY || "";

    // Verify Token
    const decoded = jwt.verify(token, secretKey);
    const user = await UserModel.findOne({ id: decoded.id });

    if (!user) {
      throw new HttpException(401, "Authentication failed!");
    }

    req.user = user;
    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
};

module.exports.setReqUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearer = "Bearer ";

    if (!authHeader || !authHeader.startsWith(bearer)) {
      return next();
    }

    const token = authHeader.replace(bearer, "");
    const secretKey = process.env.JWT_ACCESS_KEY || "";

    // Verify Token
    const decoded = jwt.verify(token, secretKey);
    const user = await UserModel.findOne({ id: decoded.id });

    if (!user) {
      return next();
    }

    req.user = user;
    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
};

module.exports.isEmployer = async (req, res, next) => {
  try {
    if (req.user.role != Role.Employer) {
      throw new HttpException(404, "You are not employer");
    }

    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
};

module.exports.isJobSeeker = async (req, res, next) => {
  try {
    if (req.user.role != Role.JobSeeker) {
      throw new HttpException(404, "You are not jobseeker");
    }

    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
};

module.exports.isJobsCreator = async (req, res, next) => {
  try {
    const cur_job = await JobModel.findOne({ id: req.params.jobId });
    if (cur_job.author != req.user.id) {
      throw new HttpException(404, "You are not author");
    }

    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
};

module.exports.canEditStatusApplication = async (req, res, next) => {
  // for employer whose job is applied
  try {
    const cur_application = await ApplicationModel.findOne({ id: req.params.applicationId });
    if (!cur_application) {
      throw new HttpException(404, "Application not found");
    }

    const cur_job = await JobModel.findOne({ id: cur_application.jobId });
    if (cur_job.author != req.user.id) {
      throw new HttpException(404, "You are not author");
    }

    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
};

module.exports.isCommentCreator = async (req, res, next) => {
  try {
    const cur_comment = await CommentModel.findOne({ id: req.params.commentId });
    if (cur_comment.author != req.user.id) {
      throw new HttpException(404, "You are not author");
    }

    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
};

module.exports.isEducationCreator = async (req, res, next) => {
  try {
    const cur_education = await EducationModel.findOne({ id: req.params.educationId });
    if (cur_education.jobseekerId != req.user.id) {
      throw new HttpException(404, "You are not author");
    }

    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
};
