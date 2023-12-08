require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs");
const { getRandomKey } = require("./getRandomKey");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.AWS_SECRETKEY,
});

module.exports.uploadFileToS3 = async (req, res) => {
  const file = req.file;
  const { path, mimetype } = file;
  var folder = "/files";
  if (mimetype && mimetype.startsWith("image/")) {
    folder = "/images";
  }
  const params = {
    Bucket: `${process.env.AWS_BUCKET_NAME}${folder}`,
    Key: getRandomKey(),
    Body: fs.createReadStream(path),
    ContentType: mimetype,
  };
  s3.upload(params, (error, data) => {
    if (error) {
      fs.unlinkSync(path);
      return res.status(500).send(error);
    }
    fs.unlinkSync(path);
    res.status(200).send(data.Location);
  });
};

//upload file and return url
module.exports.uploadFile = async (file) => {
  const { path, mimetype } = file;
  var folder = "/files";
  if (mimetype && mimetype.startsWith("image/")) {
    folder = "/images";
  }
  const params = {
    Bucket: `${process.env.AWS_BUCKET_NAME}${folder}`,
    Key: getRandomKey(),
    Body: fs.createReadStream(path),
    ContentType: mimetype,
  };
  const resUpload = await s3.upload(params).promise();
  fs.unlinkSync(path);
  return resUpload.Location;
};

//upload file using path
module.exports.uploadFileWithPath = async (path, mimetype) => {
  var folder = "/files";
  if (mimetype && mimetype.startsWith("image/")) {
    folder = "/images";
  }
  const params = {
    Bucket: `${process.env.AWS_BUCKET_NAME}${folder}`,
    Key: getRandomKey(),
    Body: fs.createReadStream(path),
    ContentType: mimetype,
  };
  const resUpload = await s3.upload(params).promise();
  fs.unlinkSync(path);
  return resUpload.Location;
};

module.exports.uploadFileLocal = async (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }

  let imgPath = process.env.URL + `/${file.filename}`;
  res.send(imgPath);
};
