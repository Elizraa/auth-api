const CreateReply = require("../../Domains/threads/reply/entities/CreateReply");

class CreateReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const createReply = new CreateReply(useCasePayload);

    await this._commentRepository.verifyCommentExist(useCasePayload);

    return this._replyRepository.createReply(createReply);
  }
}

module.exports = CreateReplyUseCase;
