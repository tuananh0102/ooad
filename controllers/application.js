const ApplicationModel = require("../models/application");
const JobModel = require("../models/job");
const JobSeekerModel = require("../models/jobseeker");
const Role = require("../constants/user");
const HttpException = require("../utils/HttpException");
const JobController = require("./job");
class ApplicationController {
  innerWithJobseekerInfo = async (application) => {
    const jobseeker = await JobSeekerModel.findOne({ id: application.jobseekerId });
    const { password, ...jobseekerWithoutPassword } = jobseeker;
    application.jobseeker = jobseekerWithoutPassword;
    return application;
  };

  getById = async (req, res, next) => {
    const application = await ApplicationModel.findOne({ id: req.params.applicationId });
    if (!application) {
      throw new HttpException(404, "Application not found");
    }

    res.send(this.innerWithJobseekerInfo(application));
  };

  getApplicationOfJob = async (req, res) => {
    //id of job
    const result = await ApplicationModel.findApplicationOfJob(req.params.jobId);
    for (let i = 0; i < result.length; i++) {
      result[i] = await this.innerWithJobseekerInfo(result[i]);
    }
    res.send(result);
  };

  getMyApplication = async (req, res) => {
    if (req.user.role == Role.JobSeeker) {
      const result = await ApplicationModel.findApplicationOfJobSeeker(req.user.id);
      for (let i = 0; i < result.length; i++) {
        const job = await JobModel.findOne({ id: result[i].jobId });
        const jobInner = await JobController.innerWithAuthorInfo(req, job);
        result[i].job = jobInner;
      }
      res.send(result);
    } else {
      const jobs = await JobModel.find({ author: req.user.id });
      var list = [];
      for (const job of jobs) {
        const result = await ApplicationModel.findApplicationOfJob(job.id);
        for (let i = 0; i < result.length; i++) {
          result[i] = await this.innerWithJobseekerInfo(result[i]);
        }
        list.push(...result);
      }
      res.send(list);
    }
  };

  createApplication = async (req, res) => {
    //id of job
    const application = await ApplicationModel.findBy({ jobId: req.params.jobId, jobseekerId: req.user.id });
    if (application && application.length > 0) {
      return res.send("Already applied");
    }

    const result = await ApplicationModel.create(req.user.id, req.params.jobId);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.send("Application was created!");
  };

  updateStatus = async (req, res) => {
    const result = await ApplicationModel.updateById({ status: req.body.status }, req.params.applicationId);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.send("Application status was updated!");
  };

  deleteApplication = async (req, res) => {
    const result = await ApplicationModel.delete(req.params.ApplicationId);
    if (!result) {
      throw new HttpException(404, "Application not found");
    }

    res.send("Application has been deleted");
  };
}

module.exports = new ApplicationController();
