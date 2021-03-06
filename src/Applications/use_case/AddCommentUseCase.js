const CreateComment = require("../../Domains/threads/comment/entities/CreateComment");

class CreateCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const createComment = new CreateComment(useCasePayload);

    await this._threadRepository.verifyThreadExist(useCasePayload.threadId);

    return this._commentRepository.addComment(createComment);
  }
}

module.exports = CreateCommentUseCase;
