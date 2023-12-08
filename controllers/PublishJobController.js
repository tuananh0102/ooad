const PublishJobForm = require("../form/PublishJobForm");
const JobModel = require("../models/job");

class PublishJobController {
  createJob = async (req, res) => {
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
}

export default new PublishJobController();
