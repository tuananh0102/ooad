const employerController = require("../controllers/employer");
const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");
const middleware = require("../middlewares/jwt");
const { validateCreateEmployer, validateUpdateEmployer } = require("../middlewares/validate/employer");
const commentController = require("../controllers/comment");
const { validateCreateComment } = require("../middlewares/validate/comment");

/**
 * @openapi
 * /api/employer:
 *  post:
 *      summary: register a new employer
 *      description: register a new Employer
 *      tags:
 *      - Employer
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
 *                          address:
 *                              example: "address"
 *                          password:
 *                              type: string
 *                              example: "123"
 *                          about:
 *                              example: "abouthehe"
 *                          wallpaper:
 *                              example: "wallpaper"
 *                          size:
 *                              example: 1000
 *      responses:
 *              200:
 *                  description: success
 */
router.post("/", validateCreateEmployer, catchAsync(employerController.register));

/**
 * @openapi
 * /api/employer:
 *  put:
 *      summary: update profile of employer
 *      description: update profile of employer
 *      tags:
 *      - Employer
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          about:
 *                              example: "abouthehe"
 *                          wallpaper:
 *                              example: "wallpaper"
 *                          size:
 *                              example: 1000
 *      responses:
 *              200:
 *                  description: success
 */
router.put("/", middleware.verifyToken, middleware.isEmployer, validateUpdateEmployer, catchAsync(employerController.updateProfile));

/**
 * @openapi
 * /api/employer:
 *  get:
 *      summary: get current employer profile
 *      tags:
 *      - Employer
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/", middleware.verifyToken, catchAsync(employerController.getCurrentEmployer));

/**
 * @openapi
 * /api/employer/{id}:
 *  get:
 *      summary: get employer by id
 *      tags:
 *      - Employer
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
router.get("/:id", catchAsync(employerController.getEmployerById));

/**
 * @openapi
 * /api/employer/recommend-jobseeker/{number}:
 *  get:
 *      summary: get recommend jobseeker
 *      tags:
 *      - Employer
 *      parameters:
 *       - in: path
 *         name: number
 *         type: string
 *         required: true
 *         description: number
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/recommend-jobseeker/:number", middleware.verifyToken, catchAsync(employerController.getRecommendJobseeker));

/**
 * @openapi
 * /api/employer/{id}/comments:
 *  get:
 *      summary: get all comments of a employer
 *      tags:
 *      - Comment
 *      parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/:id/comments", catchAsync(commentController.getCommentOfEmployer));

/**
 * @openapi
 * /api/employer/{id}/comment:
 *  post:
 *      summary: create a comment
 *      tags:
 *      - Comment
 *      parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          content:
 *                             example: "content"
 *      responses:
 *              200:
 *                  description: success
 */
router.post("/:id/comment", middleware.verifyToken, validateCreateComment, catchAsync(commentController.createComment));

module.exports = router;
