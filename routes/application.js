const applicationController = require("../controllers/application");
const router = require("express").Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const middleware = require("../middlewares/jwt");
const validateApplication = require("../middlewares/validate/application");

/**
 * @openapi
 * /api/application/mine:
 *  get:
 *      summary: get my applications
 *      description: get my applications
 *      tags:
 *      - Application
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/mine", middleware.verifyToken, catchAsync(applicationController.getMyApplication));

/**
 * @openapi
 * /api/application/{applicationId}:
 *  get:
 *      summary: get application by id
 *      description: get application by id
 *      tags:
 *      - Application
 *      parameters:
 *       - in: path
 *         name: applicationId
 *         type: string
 *         required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/:applicationId", middleware.verifyToken, catchAsync(applicationController.getById));

/**
 * @openapi
 * /api/application/{applicationId}:
 *  put:
 *      summary: update application status for employer
 *      description: for employer update application status of applicationId
 *      tags:
 *      - Application
 *      parameters:
 *       - in: path
 *         name: applicationId
 *         type: string
 *         required: true
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                             example: "accepted"
 *      responses:
 *              200:
 *                  description: success
 */
router.put(
  "/:applicationId",
  middleware.verifyToken,
  middleware.canEditStatusApplication,
  validateApplication.validateUpdateApplication,
  catchAsync(applicationController.updateStatus)
);

module.exports = router;
