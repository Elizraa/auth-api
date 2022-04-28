const DeleteReply = require("../../Domains/threads/reply/entities/DeleteReply");

class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const deleteReply = new DeleteReply(useCasePayload);

    await this._replyRepository.verifyReplyExist(useCasePayload);

    return this._replyRepository.deleteReplyById(deleteReply);
  }
}

module.exports = DeleteReplyUseCase;
