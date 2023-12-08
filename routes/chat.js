const router = require("express").Router();
const ChatController = require("../controllers/chat");
const middleware = require("../middlewares/jwt");
const catchAsync = require("../utils/catchAsync");

/**
 * @openapi
 * /api/chat/list-conversations:
 *  get:
 *      summary: get conversation
 *      tags:
 *      - Chat
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/list-conversations", middleware.verifyToken, catchAsync(ChatController.getListConversations));

/**
 * @openapi
 * /api/chat/conversation:
 *  post:
 *      summary: get conversation
 *      tags:
 *      - Chat
 *      requestBody:
 *          require: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          friendId:
 *                              type: string
 *                              example: "123"
 *      responses:
 *              200:
 *                  description: success
 */
router.post("/conversation", middleware.verifyToken, catchAsync(ChatController.getConversation));

router
  .route("/conversation/:conversationId")
  /**
   * @openapi
   * /api/chat/conversation/{conversationId}:
   *  get:
   *      summary: get list message by conversation id
   *      tags:
   *      - Chat
   *      parameters:
   *       - in: path
   *         name: conversationId
   *         type: string
   *         required: true
   *      responses:
   *              200:
   *                  description: success
   */
  .get(middleware.verifyToken, catchAsync(ChatController.getListMessage));

/**
 * @openapi
 * /api/chat/conversation/{conversationId}/{number}:
 *  get:
 *      summary: get number last message by conversation id
 *      tags:
 *      - Chat
 *      parameters:
 *       - in: path
 *         name: conversationId
 *         type: string
 *         required: true
 *       - in: path
 *         name: number
 *         type: string
 *         required: true
 *      responses:
 *              200:
 *                  description: success
 */
router.get("/conversation/:conversationId/:number", middleware.verifyToken, catchAsync(ChatController.getNumberLastMessage));

module.exports = router;
