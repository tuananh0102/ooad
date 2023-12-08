const jobController = require("../controllers/job");
const publishJobController = require("../controllers/PublishJobController");
const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");
const middleware = require("../middlewares/jwt");
const { validateCreateJob, validateUpdateJob } = require("../middlewares/validate/job");
const applicationController = require("../controllers/application");

/**
 * @openapi
 * /api/job/create:
 *  post:
 *      summary: create a job for employer
 *      tags:
 *      - Job
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              example: "title"
 *                          description:
 *                              example: "description"
 *                          requirements:
 *                              example: "requirements"
 *                          tags:
 *                              example: "tags"
 *                          startTime:
 *                              example: "2022-11-01"
 *                          endTime:
 *                              example: "2022-12-01"
 *                          salary:
 *                              example: 1000
 *                          typeOfWorking:
 *                              example: "fulltime"
 *                          gender:
 *                              example: "male"
 *                          positions:
 *                              example: "staff"
 *                          slots:
 *                              example: 10
 *                          exp:
 *                              example: "1 year"
 *                          benefits:
 *                              example: "benefit"
 *                          imageUrl:
 *                              example: "imageUrl"
 *      responses:
 *              200:
 *                  description: success
 */
router.post(
  "/create",
  middleware.verifyToken,
  middleware.isEmployer,
  validateCreateJob,
  catchAsync(publishJobController.createJob)
);

/**
 * @openapi
 * /api/job/all:
 *  get:
 *      summary: get all jobs
 *      tags:
 *      - Job
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/all", middleware.setReqUser, catchAsync(jobController.getAll));

/**
 * @openapi
 * /api/job/all-mine:
 *  get:
 *      summary: get all own jobs of current user
 *      tags:
 *      - Job
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/all-mine", middleware.verifyToken, middleware.isEmployer, catchAsync(jobController.getMyJob));

/**
 * @openapi
 * /api/job/recommend/{number}:
 *  get:
 *      summary: get number last recommend jobs
 *      tags:
 *      - Job
 *      parameters:
 *      - in: path
 *        name: number
 *        type: string
 *        required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/recommend/:number", middleware.setReqUser, catchAsync(jobController.getListSuggestion));

/**
 * @openapi
 * /api/job/find-by-keyword/{keyword}/{jobPerPage}/{pageNumber}:
 *  get:
 *      summary: find jobs by keyword
 *      tags:
 *      - Job
 *      parameters:
 *      - in: path
 *        name: keyword
 *        type: string
 *        required: true
 *      - in: path
 *        name: jobPerPage
 *        type: string
 *        required: true
 *      - in: path
 *        name: pageNumber
 *        type: string
 *        required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.get(
  "/find-by-keyword/:keyword/:jobPerPage/:pageNumber",
  middleware.setReqUser,
  catchAsync(jobController.findJobByKeyWord)
);

/**
 * @openapi
 * /api/job/suggest-keyword/{number}/{keyword}:
 *  get:
 *      summary: get suggest-keyword for jobs
 *      tags:
 *      - Job
 *      parameters:
 *      - in: path
 *        name: number
 *        type: string
 *        required: true
 *      - in: path
 *        name: keyword
 *        type: string
 *        required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.get(
  "/suggest-keyword/:number/:keyword",
  middleware.setReqUser,
  catchAsync(jobController.getListSuggestionKeyWord)
);

/**
 * @openapi
 * /api/job/favourite/find-by-keyword/{keyword}/{jobPerPage}/{pageNumber}:
 *  get:
 *      summary: find jobs in favourite by keyword
 *      tags:
 *      - Job
 *      parameters:
 *      - in: path
 *        name: keyword
 *        type: string
 *        required: true
 *      - in: path
 *        name: jobPerPage
 *        type: string
 *        required: true
 *      - in: path
 *        name: pageNumber
 *        type: string
 *        required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.get(
  "/favourite/find-by-keyword/:keyword/:jobPerPage/:pageNumber",
  middleware.verifyToken,
  catchAsync(jobController.findJobInBookmarkByKeyWord)
);

/**
 * @openapi
 * /api/job/favourite/suggest-keyword/{number}/{keyword}:
 *  get:
 *      summary: get suggest-keyword for jobs in favourite
 *      tags:
 *      - Job
 *      parameters:
 *      - in: path
 *        name: number
 *        type: string
 *        required: true
 *      - in: path
 *        name: keyword
 *        type: string
 *        required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.get(
  "/favourite/suggest-keyword/:number/:keyword",
  middleware.verifyToken,
  catchAsync(jobController.getListSuggestionKeyWordInBookark)
);

/**
 * @openapi
 * /api/job/getPageSuggestion/{jobPerPage}/{pageNumber}:
 *  get:
 *      summary: get page suggestion jobs
 *      description: jobPerPage is number of job per page, pageNumber is number of page
 *      tags:
 *      - Job
 *      parameters:
 *      - in: path
 *        name: jobPerPage
 *        type: number
 *        required: true
 *      - in: path
 *        name: pageNumber
 *        type: number
 *        required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.get(
  "/getPageSuggestion/:jobPerPage/:pageNumber",
  middleware.setReqUser,
  catchAsync(jobController.getPageSuggestion)
);

/**
 * @openapi
 * /api/job/list-marked:
 *  get:
 *      summary: get list marked job
 *      description: get list marked job
 *      tags:
 *      - Job
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/list-marked", middleware.verifyToken, middleware.isJobSeeker, catchAsync(jobController.listMarked));

/**
 * @openapi
 * /api/job/import:
 *  post:
 *      summary: import jobs from google sheet
 *      tags:
 *      - Job
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          sheetId:
 *                              example: "18lcFL76xNC3rzFce5bKjNV9-04sKLy2KmLiG2EbotPE"
 *      responses:
 *              200:
 *                  description: success
 */
router.post("/import", middleware.verifyToken, middleware.isEmployer, catchAsync(jobController.import));

/**
 * @openapi
 * /api/job/filter/{jobPerPage}/{pageNumber}:
 *  post:
 *      summary: filter jobs from one or more feilds below
 *      tags:
 *      - Job
 *      parameters:
 *      - in: path
 *        name: jobPerPage
 *        type: number
 *        required: true
 *      - in: path
 *        name: pageNumber
 *        type: number
 *        required: true
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          company:
 *                              example: "Google"
 *                          category:
 *                              example: "Staff"
 *                          skill:
 *                              example: "BA"
 *                          location:
 *                              example: "Ha Noi"
 *                          salaryMin:
 *                              example: 1
 *                          salaryMax:
 *                              example: 1000
 *                          typeOfWorking:
 *                              example: "remote"
 *                          jobType:
 *                              example: "fulltime"
 *                          experience:
 *                              example: "1 year"
 *      responses:
 *              200:
 *                  description: success
 */
router.post("/filter/:jobPerPage/:pageNumber", middleware.setReqUser, catchAsync(jobController.filter));

//get, edit, delete
router
  .route("/:jobId")
  /**
   * @openapi
   * /api/job/{jobId}:
   *  get:
   *      summary: get job by id
   *      tags:
   *      - Job
   *      parameters:
   *       - in: path
   *         name: jobId
   *         type: string
   *         required: true
   *      responses:
   *              200:
   *                  description: success
   */
  .get(middleware.setReqUser, catchAsync(jobController.getById))
  /**
   * @openapi
   * /api/job/{jobId}:
   *  put:
   *      summary: edit an own job for employer
   *      tags:
   *      - Job
   *      parameters:
   *       - in: path
   *         name: jobId
   *         type: string
   *         required: true
   *      requestBody:
   *          require: true
   *          content:
   *              application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                          title:
   *                              example: "title"
   *                          description:
   *                              example: "description"
   *                          requirements:
   *                              example: "requirements"
   *                          tags:
   *                              example: "tags"
   *                          startTime:
   *                              example: "2022-11-01"
   *                          endTime:
   *                              example: "2022-12-01"
   *                          salary:
   *                              example: 1000
   *                          typeOfWorking:
   *                              example: "fulltime"
   *                          gender:
   *                              example: "male"
   *                          positions:
   *                              example: "staff"
   *                          slots:
   *                              example: 10
   *                          exp:
   *                              example: "1 year"
   *                          benefits:
   *                              example: "benefit"
   *                          imageUrl:
   *                              example: "imageUrl"
   *      responses:
   *              200:
   *                  description: success
   */
  .put(middleware.verifyToken, middleware.isJobsCreator, validateUpdateJob, catchAsync(jobController.update))
  /**
   * @openapi
   * /api/job/{jobId}:
   *  delete:
   *      summary: delete own job for employer
   *      tags:
   *      - Job
   *      parameters:
   *       - in: path
   *         name: jobId
   *         type: string
   *         required: true
   *      responses:
   *              200:
   *                  description: success
   */
  .delete(middleware.verifyToken, middleware.isJobsCreator, catchAsync(jobController.delete));

/**
 * @openapi
 * /api/job/{jobId}/apply:
 *  post:
 *      summary: create an application, apply to this job
 *      description: for jobseeker create an application for job
 *      tags:
 *      - Application
 *      parameters:
 *       - in: path
 *         name: jobId
 *         type: string
 *         required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.post(
  "/:jobId/apply",
  middleware.verifyToken,
  middleware.isJobSeeker,
  catchAsync(applicationController.createApplication)
);

/**
 * @openapi
 * /api/job/{jobId}/applications:
 *  get:
 *      summary: get applications of job for employer
 *      description: get applications of job for employer
 *      tags:
 *      - Application
 *      parameters:
 *       - in: path
 *         name: jobId
 *         type: string
 *         required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/:jobId/applications", middleware.verifyToken, catchAsync(applicationController.getApplicationOfJob));

/**
 * @openapi
 * /api/job/{jobId}/marked:
 *  get:
 *      summary: get status is marked or not
 *      description: get status is marked or not
 *      tags:
 *      - Job
 *      parameters:
 *       - in: path
 *         name: jobId
 *         type: string
 *         required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/:jobId/marked", middleware.verifyToken, middleware.isJobSeeker, catchAsync(jobController.isMarked));

/**
 * @openapi
 * /api/job/{jobId}/mark:
 *  post:
 *      summary: mark job as favorite
 *      description: mark job as favorite
 *      tags:
 *      - Job
 *      parameters:
 *       - in: path
 *         name: jobId
 *         type: string
 *         required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.post("/:jobId/mark", middleware.verifyToken, middleware.isJobSeeker, catchAsync(jobController.createMark));

/**
 * @openapi
 * /api/job/{jobId}/unmark:
 *  delete:
 *      summary: unmark job in favorite
 *      description: unmark job in favorite
 *      tags:
 *      - Job
 *      parameters:
 *       - in: path
 *         name: jobId
 *         type: string
 *         required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.delete("/:jobId/unmark", middleware.verifyToken, middleware.isJobSeeker, catchAsync(jobController.deleteMark));

module.exports = router;
