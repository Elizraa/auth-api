const DeleteComment = require("../../Domains/threads/comment/entities/DeleteComment");

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);

    await this._commentRepository.verifyCommentExist(useCasePayload);

    return this._commentRepository.deleteCommentById(deleteComment);
  }
}

module.exports = DeleteCommentUseCase;
