const CommentModel = require("../models/comment");
const HttpException = require("../utils/HttpException");
const UserModel = require("../models/user");
const user = require("../constants/user");

class CommentController {
  innerCommentWithUser = async (comment) => {
    const user = await UserModel.findOne({ id: comment.author });
    const { password, ...userWithoutPassword } = user;
    comment.user = userWithoutPassword;
    return comment;
  };

  // crud
  getComment = async (req, res) => {
    const result = await CommentModel.findOne({ id: req.params.commentId });
    res.send(await this.innerCommentWithUser(result));
  };

  getCommentOfEmployer = async (req, res) => {
    //id of job
    const result = await CommentModel.findCommentOfEmployer(req.params.id);
    const listComment = [];
    for (let c of result) {
      listComment.push(await this.innerCommentWithUser(c));
    }
    res.send(listComment);
  };

  createComment = async (req, res) => {
    const result = await CommentModel.create(req.user.id, req.params.id, req.body.content);

    if (!result) {
      throw new HttpException(500, "Something went wrong");
    }

    res.send("Comment was created!");
  };

  updateComment = async (req, res) => {
    const result = await CommentModel.update(req.body, req.params.commentId);

    if (!result) {
      throw new HttpException(404, "Something went wrong");
    }

    const { affectedRows, changedRows, info } = result;

    const message = !affectedRows ? "Comment not found" : affectedRows && changedRows ? "Comment updated successfully" : "Updated faild";

    res.send({ message, info });
  };

  deleteComment = async (req, res) => {
    const result = await CommentModel.delete(req.params.commentId);
    if (!result) {
      throw new HttpException(404, "Comment not found");
    }

    res.send("Comment has been deleted");
  };
}

module.exports = new CommentController();
