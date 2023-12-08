const EducationModel = require("../models/education");
const HttpException = require("../utils/HttpException");
const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
class EducationController {
  getMine = async (req, res) => {
    let list = await EducationModel.find({ jobseekerId: req.user.id });
    res.send(list);
  };

  getEducationOf = async (req, res) => {
    let list = await EducationModel.find({ jobseekerId: req.params.jobseekerId });
    res.send(list);
  };

  getById = async (req, res) => {
    const education = await EducationModel.findOne({ id: req.params.educationId });
    if (!education) {
      throw new HttpException(404, "education not found");
    }
    res.send(education);
  };

  create = async (req, res) => {
    const { school, degree, major, startDate, endDate, description } = req.body;
    const newId = uuidv4();
    const result = await EducationModel.create({
      id: newId,
      jobseekerId: req.user.id,
      school,
      degree,
      major,
      startDate,
      endDate,
      description,
    });

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.send("Education was created!");
  };

  update = async (req, res) => {
    const result = await EducationModel.update(req.body, req.params.educationId);

    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows ? "Education not found" : affectedRows && changedRows ? "Education updated successfully" : "Updated faild";

    res.send({ message, info });
  };

  delete = async (req, res) => {
    const result = await EducationModel.delete(req.params.educationId);
    if (!result) {
      throw new HttpException(404, "Education not found");
    }
    res.send("Education has been deleted");
  };
}

module.exports = new EducationController();
