const jobseekerController = require("../controllers/jobseeker");
const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");
const middleware = require("../middlewares/jwt");
const { validateCreateJobseeker, validateUpdateJobseeker } = require("../middlewares/validate/jobseeker");
const multer = require("multer");

/**
 * @openapi
 * /api/jobseeker:
 *  post:
 *      summary: register a new jobseeker
 *      description: register a new jobseeker
 *      tags:
 *      - Jobseeker
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              example: "tanhne"
 *                          name:
 *                              example: "Tanh"
 *                          email:
 *                              example: "tanhtanh1505@gmail.com"
 *                          phone:
 *                              example: "0944150502"
 *                          avatar:
 *                              example: "avatar"
 *                          password:
 *                              type: string
 *                              example: "123"
 *                          address:
 *                              example: "address"
 *                          age:
 *                              example:  20
 *                          gender:
 *                              example: "male"
 *                          experience:
 *                              example: "2 years"
 *                          advanedSkill:
 *                              example: "advanced skill"
 *                          salary:
 *                              example:  1000
 *                          workplace:
 *                              example: "Ha Noi"
 *                          cv:
 *                              example: "cv link"
 *                          careerFeild:
 *                              example: "web"
 *                          typeOfJob:
 *                              example: "fulltime"
 *      responses:
 *              200:
 *                  description: success
 */
router.post("/", validateCreateJobseeker, catchAsync(jobseekerController.register));

/**
 * @openapi
 * /api/jobseeker:
 *  put:
 *      summary: update profile of jobseeker
 *      description: update profile of jobseeker
 *      tags:
 *      - Jobseeker
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          age:
 *                              example: 20
 *                          gender:
 *                              example: "male"
 *                          experience:
 *                              example: "2 years"
 *                          advanedSkill:
 *                              example: "advanced skill"
 *                          salary:
 *                              example: 1000
 *                          workplace:
 *                              example: "Ha Noi"
 *                          cv:
 *                              example: "cv link"
 *                          careerFeild:
 *                              example: "web"
 *                          typeOfJob:
 *                              example: "fulltime"
 *      responses:
 *              200:
 *                  description: success
 */
router.put(
  "/",
  middleware.verifyToken,
  middleware.isJobSeeker,
  validateUpdateJobseeker,
  catchAsync(jobseekerController.updateProfile)
);

/**
 * @openapi
 * /api/jobseeker:
 *  get:
 *      summary: get current jobseeker profile
 *      tags:
 *      - Jobseeker
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/", middleware.verifyToken, middleware.isJobSeeker, catchAsync(jobseekerController.getCurrentJobseeker));

/**
 * @openapi
 * /api/jobseeker/{id}:
 *  get:
 *      summary: get jobseeker by id
 *      tags:
 *      - Jobseeker
 *      parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         description: id
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/:id", catchAsync(jobseekerController.getJobseekerById));

module.exports = router;
