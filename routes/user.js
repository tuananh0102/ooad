const userController = require("../controllers/user");
const router = require("express").Router();
const catchAsync = require("../utils/catchAsync");
const middleware = require("../middlewares/jwt");
const { validateCreateUser, validateUpdateUser } = require("../middlewares/validate/user");

/**
 * @openapi
 * /api/user:
 *  get:
 *      summary: get profile of user
 *      tags:
 *      - User
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/", middleware.verifyToken, catchAsync(userController.getCurrentUser));
/**
 * @openapi
 * /api/user:
 *  put:
 *      summary: edit profile of user
 *      description: edit profile of user
 *      tags:
 *      - User
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              example: "Tanh"
 *                          avatar:
 *                              example: "avatar"
 *                          address:
 *                              example: "address"
 *      responses:
 *              200:
 *                  description: success
 */
router.put("/", middleware.verifyToken, validateUpdateUser, catchAsync(userController.updateUser));
/**
 * @openapi
 * /api/user:
 *  delete:
 *      summary: delete user
 *      tags:
 *      - User
 *      responses:
 *              200:
 *                  description: success
 */
router.delete("/", middleware.verifyToken, catchAsync(userController.deleteUser));
/**
 * @openapi
 * /api/user/allUser:
 *  get:
 *      summary: api test get all user
 *      tags:
 *      - User
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/allUser", catchAsync(userController.getAllUsers));
/**
 * @openapi
 * /api/user/{username}:
 *  get:
 *      summary: get user by username
 *      tags:
 *      - User
 *      parameters:
 *       - in: path
 *         name: username
 *         type: string
 *         required: true
 *         description: username
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/:username", catchAsync(userController.getUserByUserName));

/**
 * @openapi
 * /api/user/check-exist:
 *  post:
 *      summary: check if username, email or phone exist
 *      tags:
 *      - User
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              example: "tanhne"
 *                          email:
 *                              example: "email"
 *                          phone:
 *                              example: "0944150502"
 *      responses:
 *              200:
 *                  description: success
 */
router.post("/check-exist", catchAsync(userController.checkExist));

// router.post("/uploadAvatar", catchAsync(user.uploadAvatar));

module.exports = router;
