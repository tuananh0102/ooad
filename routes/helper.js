const router = require("express").Router();
const { uploadFileToS3, uploadFileLocal } = require("../helper/uploadImageHelper");

const upload = require("../models/multer.js");
const catchAsync = require("../utils/catchAsync");
const { required } = require("joi");

/**
 * @openapi
 * /api/helper/upload:
 *  post:
 *      summary: Upload image to S3
 *      tags:
 *      - Helper
 *      requestBody:
 *          require: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          file:
 *                              type: string
 *                              format: binary
 *      responses:
 *              200:
 *                  description: success
 */
router.post("/upload", upload.single("file"), catchAsync(uploadFileLocal));

module.exports = router;
