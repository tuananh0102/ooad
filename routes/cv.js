const cvController = require("../controllers/cv");
const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");
const middleware = require("../middlewares/jwt");
const upload = require("../models/multer.js");

/**
 * @openapi
 * /api/cv/create:
 *  post:
 *      summary: Create CV
 *      tags:
 *      - Cv
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
router.post("/create", upload.single("file"), catchAsync(cvController.create));

/**
 * @openapi
 * /api/cv/generate:
 *  post:
 *      summary: Generate CV
 *      tags:
 *      - Cv
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          cv:
 *                              example: {}
 *      responses:
 *              200:
 *                  description: success
 */
router.post("/generate", middleware.verifyToken, middleware.isJobSeeker, catchAsync(cvController.generatePdf));

/**
 * @openapi
 * /api/cv/random:
 *  post:
 *      summary: Random CV for test
 *      tags:
 *      - Cv
 *      responses:
 *              200:
 *                  description: success
 */
router.post("/random", middleware.verifyToken, middleware.isJobSeeker, catchAsync(cvController.randomPdf));

/**
 * @openapi
 * /api/cv/upload:
 *  post:
 *      summary: Upload CV
 *      tags:
 *      - Cv
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
router.post(
  "/upload",
  middleware.verifyToken,
  middleware.isJobSeeker,
  upload.single("file"),
  catchAsync(cvController.uploadCv)
);

/**
 * @openapi
 * /api/cv/{position}:
 *  delete:
 *      summary: Delete CV
 *      tags:
 *      - Cv
 *      parameters:
 *       - in: path
 *         name: position
 *         type: number
 *         required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.delete("/:position", middleware.verifyToken, catchAsync(cvController.delete));

module.exports = router;
