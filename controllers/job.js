const UserModel = require("../models/user");
const EmployerModel = require("../models/employer");
const BookmarkModel = require("../models/bookmark");
const ApplicationModel = require("../models/application");
const JobModel = require("../models/job");
const HttpException = require("../utils/HttpException");
const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
const sheets = require("../utils/sheets/index");
const PublishJobForm = require("../form/PublishJobForm");

class JobController {
  getBookmark = async (user, job) => {
    if (user) {
      const bookmark = await BookmarkModel.findOne({ jobId: job.id, jobseekerId: user.id });
      if (bookmark) {
        return true;
      }
    }
    return false;
  };

  getApplication = async (user, job) => {
    if (user) {
      const apply = await ApplicationModel.findOne({ jobId: job.id, jobseekerId: user.id });
      if (apply) {
        return true;
      }
    }
    return false;
  };

  innerWithAuthorInfo = async (req, job) => {
    const bookmark = await this.getBookmark(req.user, job);
    const apply = await this.getApplication(req.user, job);
    const author = await EmployerModel.findOne({ id: job.author });
    return {
      ...job,
      authorName: author.name,
      authorAddress: author.address,
      authorEmail: author.email,
      authorPhone: author.phone,
      authorAvatar: author.avatar,
      authorAbout: author.about,
      authorSize: author.size,
      bookmark: bookmark,
      apply: apply,
    };
  };

  getAll = async (req, res) => {
    let listJob = await JobModel.find();
    var resListJob = [];
    for (let i = 0; i < listJob.length; i++) {
      resListJob.push(await this.innerWithAuthorInfo(req, listJob[i]));
    }

    return res.send(resListJob);
  };

  getOneSuggestion = async (req, res) => {
    const listJob = await JobModel.find({});
    var resListJob = [];
    for (let i = 0; i < listJob.length; i++) {
      var temp = await this.innerWithAuthorInfo(req, listJob[i]);
      if (!temp.apply) {
        resListJob.push(temp);
        break;
      }
    }
    res.send(resListJob);
  };

  getListSuggestion = async (req, res) => {
    const { number } = req.params;
    const listJob = await JobModel.find({});
    var resListJob = [];
    while (resListJob.length < number) {
      for (let i = 0; i < listJob.length; i++) {
        var temp = await this.innerWithAuthorInfo(req, listJob[i]);
        if (!temp.apply) {
          resListJob.push(temp);
          if (resListJob.length >= number) break;
        }
      }
    }
    res.send(resListJob);
  };

  findJobByKeyWord = async (req, res) => {
    const { keyword, jobPerPage, pageNumber } = req.params;
    const listJob = await JobModel.find({});
    const resListJob = new Set();
    for (let i = 0; i < listJob.length; i++) {
      const job = await this.innerWithAuthorInfo(req, listJob[i]);
      if (job.title.toLowerCase().includes(keyword.toLowerCase())) {
        resListJob.add(job);
      } else if (job.positions.toLowerCase().includes(keyword.toLowerCase())) {
        resListJob.add(job);
      } else if (job.tags.toLowerCase().includes(keyword.toLowerCase())) {
        resListJob.add(job);
      } else if (job.authorName.toLowerCase().includes(keyword.toLowerCase())) {
        resListJob.add(job);
      }
    }

    const resListJobArray = Array.from(resListJob);
    const resListJobArraySlice = resListJobArray.slice((pageNumber - 1) * jobPerPage, pageNumber * jobPerPage);
    return res.send(resListJobArraySlice);
  };

  findJobInBookmarkByKeyWord = async (req, res) => {
    const { keyword, jobPerPage, pageNumber } = req.params;
    const listJob = await JobModel.find({});
    const resListJob = new Set();
    for (let i = 0; i < listJob.length; i++) {
      const job = await this.innerWithAuthorInfo(req, listJob[i]);
      if (!job.bookmark) continue;
      if (job.title.toLowerCase().includes(keyword.toLowerCase())) {
        resListJob.add(job);
      } else if (job.positions.toLowerCase().includes(keyword.toLowerCase())) {
        resListJob.add(job);
      } else if (job.tags.toLowerCase().includes(keyword.toLowerCase())) {
        resListJob.add(job);
      } else if (job.authorName.toLowerCase().includes(keyword.toLowerCase())) {
        resListJob.add(job);
      }
    }

    const resListJobArray = Array.from(resListJob);
    const resListJobArraySlice = resListJobArray.slice((pageNumber - 1) * jobPerPage, pageNumber * jobPerPage);
    return res.send(resListJobArraySlice);
  };

  getListSuggestionKeyWord = async (req, res) => {
    const { number, keyword } = req.params;
    const result = new Set();

    //job
    const listJob = await JobModel.find();
    for (let i = 0; i < listJob.length; i++) {
      if (result.size >= number) break;
      if (listJob[i].title.toLowerCase().includes(keyword.toLowerCase())) {
        result.add(listJob[i].title);
      }
      if (listJob[i].positions.toLowerCase().includes(keyword.toLowerCase())) {
        result.add(listJob[i].positions);
      }
      listJob[i].tags.split(",").forEach((tag) => {
        if (tag.toLowerCase().includes(keyword.toLowerCase())) {
          result.add(tag);
        }
      });
    }

    //employer
    const listEmployer = await EmployerModel.find();
    for (let i = 0; i < listEmployer.length; i++) {
      if (result.size >= number) break;
      if (listEmployer[i].name.toLowerCase().includes(keyword.toLowerCase())) {
        result.add(listEmployer[i].name);
      }
      if (listEmployer[i].address.toLowerCase().includes(keyword.toLowerCase())) {
        result.add(listEmployer[i].address);
      }
    }
    res.send([...result]);
  };

  getListSuggestionKeyWordInBookark = async (req, res) => {
    const { number, keyword } = req.params;
    const result = new Set();
    //job
    const listJobNormal = await JobModel.find();
    const listJob = [];
    for (let i = 0; i < listJobNormal.length; i++) {
      if (await this.getBookmark(req.user, listJobNormal[i])) {
        listJob.push(listJobNormal[i]);
      }
    }

    //check if job are marked

    for (let i = 0; i < listJob.length; i++) {
      if (result.size >= number) break;
      if (listJob[i].title.toLowerCase().includes(keyword.toLowerCase())) {
        result.add(listJob[i].title);
      }
      if (listJob[i].positions.toLowerCase().includes(keyword.toLowerCase())) {
        result.add(listJob[i].positions);
      }
      listJob[i].tags.split(",").forEach((tag) => {
        if (tag.toLowerCase().includes(keyword.toLowerCase())) {
          result.add(tag);
        }
      });

      //employer
      const tempEmployer = await EmployerModel.findOne({ id: listJob[i].author });
      if (tempEmployer.name.toLowerCase().includes(keyword.toLowerCase())) {
        result.add(tempEmployer.name);
      }
      if (tempEmployer.address.toLowerCase().includes(keyword.toLowerCase())) {
        result.add(tempEmployer.address);
      }
    }

    res.send([...result]);
  };

  getPageSuggestion = async (req, res) => {
    const { jobPerPage, pageNumber } = req.params;
    const listJob = await JobModel.findLimitOffset({}, jobPerPage, (pageNumber - 1) * jobPerPage);
    var resListJob = [];
    for (let i = 0; i < listJob.length; i++) {
      var temp = await this.innerWithAuthorInfo(req, listJob[i]);
      resListJob.push(temp);
    }
    res.send(resListJob);
  };

  getById = async (req, res) => {
    const job = await JobModel.findOne({ id: req.params.jobId });
    if (!job) {
      throw new HttpException(404, "Job not found");
    }
    var tempJob = await this.innerWithAuthorInfo(req, job);

    res.send(tempJob);
  };

  getMyJob = async (req, res) => {
    let listJobs = await JobModel.find({ author: req.user.id });
    const result = [];
    for (let i = 0; i < listJobs.length; i++) {
      result.push(await this.innerWithAuthorInfo(req, listJobs[i]));
    }
    res.send(result);
  };

  create = async (req, res) => {
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
      res.send("Missing info!");
    }

    // resolve tags
    const tagsArray = tags.split(",").filter((tag) => tag && tag.trim() !== "");
    const tagsString = tagsArray.join(",");

    const newJobId = uuidv4();
    const result = await JobModel.create({
      id: newJobId,
      title,
      description,
      requirements,
      tags: tagsString,
      author: req.user.id,
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
    });

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.send("Jobs was created!");
  };

  update = async (req, res) => {
    const result = await JobModel.update(req.body, req.params.jobId);

    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows
      ? "Job not found"
      : affectedRows && changedRows
      ? "Job updated successfully"
      : "Updated faild";

    res.send({ message, info });
  };

  delete = async (req, res) => {
    const result = await JobModel.delete(req.params.jobId);
    if (!result) {
      throw new HttpException(404, "Job not found");
    }
    res.send("Job has been deleted");
  };

  filter = async (req, res) => {
    const { company, category, skill, location, salaryMin, salaryMax, typeOfWorking, jobType, experience } = req.body;
    const { jobPerPage, pageNumber } = req.params;

    const listJob = await JobModel.find({});
    const resListJob = Array.from(listJob);
    for (let i = 0; i < resListJob.length; i++) {
      const job = await this.innerWithAuthorInfo(req, resListJob[i]);
      var check = false;
      if (company && !job.authorName.toLowerCase().includes(company.toLowerCase())) {
        check = true;
      } else if (category && !job.positions.toLowerCase().includes(category.toLowerCase())) {
        check = true;
      } else if (skill && !job.tags.toLowerCase().includes(skill.toLowerCase())) {
        check = true;
      } else if (location && !job.authorAddress.toLowerCase().includes(location.toLowerCase())) {
        check = true;
      } else if (salaryMin && salaryMax && !(job.salary >= salaryMin && job.salary <= salaryMax)) {
        check = true;
      } else if (salaryMin && !(job.salary >= salaryMin)) {
        check = true;
      } else if (salaryMax && !(job.salary <= salaryMax)) {
        check = true;
      } else if (typeOfWorking && !job.typeOfWorking.toLowerCase().includes(typeOfWorking.toLowerCase())) {
        check = true;
      } else if (jobType && !job.typeOfWorking.toLowerCase().includes(jobType.toLowerCase())) {
        check = true;
      } else if (experience && !job.exp.toLowerCase().includes(experience.toLowerCase())) {
        check = true;
      }
      if (check) {
        resListJob.splice(i, 1);
        i--;
      }
    }
    return res.send(resListJob.slice((pageNumber - 1) * jobPerPage, pageNumber * jobPerPage));
  };

  //import from google sheet
  import = async (req, res) => {
    const sheetName = "Data";
    const { sheetId } = req.body;
    const client = await sheets.authorize();
    const values = [
      [
        "title",
        "description",
        "requirements",
        "tags",
        "startTime",
        "endTime",
        "salary",
        "typeOfWorking",
        "gender",
        "positions",
        "slots",
        "exp",
        "benefits",
        "imageUrl",
      ],
    ];
    const listOfSheet = await sheets.getListOfSheets(client, sheetId);

    if (Array.from(listOfSheet).indexOf(sheetName) == -1) {
      await sheets.createSheet(client, sheetId, sheetName);
    }
    const data = await sheets.getValues(client, sheetId, sheetName);

    if (!data || data.length <= 0) {
      await sheets.updateValues(client, sheetId, sheetName, values);
      return res.send("Init construction successfully! Please add data to sheet");
    } else {
      //validate format
      for (let i = 0; i < data[0].length; i++) {
        if (data[0][i] != values[0][i]) {
          throw new HttpException(400, "Sheet format is not correct");
        }
      }

      //import data
      for (let i = 1; i < data.length; i++) {
        const newJobId = uuidv4();
        const result = await JobModel.create({
          id: newJobId,
          title: data[i][0],
          description: data[i][1],
          requirements: data[i][2],
          tags: data[i][3],
          author: req.user.id,
          startTime: data[i][4],
          endTime: data[i][5],
          salary: data[i][6],
          typeOfWorking: data[i][7],
          gender: data[i][8],
          positions: data[i][9],
          slots: data[i][10],
          exp: data[i][11],
          benefits: data[i][12],
          imageUrl: data[i][13],
        });

        if (!result) {
          throw new HttpException(500, "Something went wrong");
        }
      }
    }
    res.send("Import success");
  };

  //get list marked
  listMarked = async (req, res) => {
    let listJob = await JobModel.find();
    var resListJob = [];
    for (let i = 0; i < listJob.length; i++) {
      const tempJob = await this.innerWithAuthorInfo(req, listJob[i]);
      if (tempJob.bookmark) {
        resListJob.push(tempJob);
      }
    }
    res.send(resListJob);
  };

  isMarked = async (req, res) => {
    const { jobId } = req.params;
    const { id } = req.user;
    const user = await UserModel.findOne({ id });
    if (!user) {
      throw new HttpException(404, "User not found");
    }
    const bookmark = await BookmarkModel.findOne({ jobId, jobseekerId: user.id });

    if (!bookmark) {
      res.send(false);
    } else {
      res.send(true);
    }
  };

  createMark = async (req, res) => {
    const result = await BookmarkModel.create(req.user.id, req.params.jobId);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.send("Bookmark was created!");
  };

  deleteMark = async (req, res) => {
    const result = await BookmarkModel.delete(req.user.id, req.params.jobId);
    if (!result) {
      throw new HttpException(404, "Bookmark not found");
    }

    res.send("Bookmark has been deleted");
  };
}

module.exports = new JobController();
