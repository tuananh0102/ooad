const JobModel = require("../models/job");
const UserModel = require("../models/user");
const JobseekerModel = require("../models/jobseeker");
const EmployerModel = require("../models/employer");
const { v4: uuidv4 } = require("uuid");
const Role = require("../constants/user");
const bcrypt = require("bcryptjs");
const mailService = require("../services/mail");
const { creatContent } = require("../helper/templateMail");
require("dotenv").config();

module.exports.register = async (req, res) => {
  const { username, name, password, email, phone, avatar, address, about, wallpaper, size } = req.body;
  const id = uuidv4();
  var user = await UserModel.findOne({ username });
  if (user) {
    return res.status(409).send("Username already in use");
  }
  user = await UserModel.findOne({ email });
  if (user) {
    return res.status(409).send("Email already in use");
  }
  user = await UserModel.findOne({ phone });
  if (user) {
    return res.status(409).send("Phone already in use");
  }
  const hashedpassword = await bcrypt.hash(password, 8);
  const newUser = await UserModel.create({
    id,
    username,
    password: hashedpassword,
    name,
    email,
    phone,
    role: Role.Employer,
    avatar,
    address,
  });
  if (newUser) {
    const newEmployer = await EmployerModel.create({ id: id, about: about, wallpaper: wallpaper, size: size });
    if (newEmployer) {
      const mailOptions = {
        from: "service@tanhuet.com",
        to: email,
        subject: "Welcome to Working On Paradise",
        html: creatContent(
          name,
          "Register successfully",
          "Welcome to Working On Paradise",
          "G O&nbsp; &nbsp;T O&nbsp; &nbsp;W E B S I T E",
          process.env.CLIENT_URL
        ),
      };

      mailService.sendMail(mailOptions);

      return res.status(200).send("Employer registered successfully");
    }
    return res.status(500).send("Error registering employer");
  }
  return res.status(500).send("Error registering employer and user");
};

//edit profile
module.exports.updateProfile = async (req, res) => {
  const { about, wallpaper, size } = req.body;
  const employer = await EmployerModel.findOne({ id: req.user.id });
  if (!employer) {
    return res.status(409).send("Employer not found");
  }
  const newEmployer = await EmployerModel.update(
    {
      about,
      wallpaper,
      size,
    },
    req.user.id
  );
  if (newEmployer) {
    return res.status(200).send("Employer edited successfully");
  }
  return res.status(500).send("Error editing employer");
};

//get current employer
module.exports.getCurrentEmployer = async (req, res) => {
  return res.status(200).send(await getEmployerWithoutPassword(req.user.id));
};

//get employer by id
module.exports.getEmployerById = async (req, res) => {
  return res.status(200).send(await getEmployerWithoutPassword(req.params.id));
};

module.exports.getRecommendJobseeker = async (req, res) => {
  //get all tags from job of employer
  const job = await JobModel.find({ author: req.user.id });
  var tags = [];
  for (var i = 0; i < job.length; i++) {
    tags.push(...job[i].tags.split(",").map((j) => j.trim()));
  }

  const jobseekers = await JobseekerModel.find();
  if (!jobseekers) {
    return res.status(409).send("Jobseeker not found");
  }
  const recommendJobseekers = [];
  for (let i = 0; i < jobseekers.length; i++) {
    const jobseeker = jobseekers[i];
    const careerFeilds = jobseeker.careerFeild.split(",").map((c) => c.trim());
    var added = false;
    for (let tag of tags) {
      if (added) break;

      for (let careerFeild of careerFeilds) {
        if (added) break;

        if (equalByRate(tag, careerFeild, 0.5)) {
          const { password, ...jobseekerWithoutPassword } = jobseeker;
          recommendJobseekers.push(jobseekerWithoutPassword);
          added = true;
        }
      }
    }
  }

  const { number } = req.params;
  //if dont need jobseeker valid, add random
  if (recommendJobseekers.length < number) {
    recommendJobseekers.push(
      ...jobseekers.map((js) => {
        const { password, ...jobseekerWithoutPassword } = js;
        return jobseekerWithoutPassword;
      })
    );
  }

  recommendJobseekers.splice(number);
  return res.status(200).send(recommendJobseekers);
};

equalByRate = (src, element, rate) => {
  const charSet = [];
  for (let i = 0; i < src.length; i++) {
    charSet.push(src[i]);
  }
  for (let i = 0; i < element.length; i++) {
    const index = charSet.indexOf(element[i]);
    if (index != -1) {
      charSet.splice(index, 1);
    }
  }
  if ((charSet.length * 1.0) / src.length <= 1 - rate) return true;

  return false;
};

getEmployerWithoutPassword = async (id) => {
  const employer = await EmployerModel.findOne({ id: id });
  if (!employer) {
    return null;
  }
  const { password, ...employerWithoutPassword } = employer;
  return employerWithoutPassword;
};
