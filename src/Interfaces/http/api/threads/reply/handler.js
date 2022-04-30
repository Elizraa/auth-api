const DeleteReplyUseCase = require("../../../../../Applications/use_case/DeleteReplyUseCase");
const AddReplyUseCase = require("../../../../../Applications/use_case/AddReplyUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { content } = request.payload;
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute({
      content,
      owner,
      threadId,
      commentId,
    });

    const response = h.response({
      status: "success",
      message: "berhasil menambahkan balasan",
      data: {
        addedReply,
      },
    });

    response.code(201);
    return response;
  }

  async deleteReplyByIdHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: owner } = request.auth.credentials;

    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );
    await deleteReplyUseCase.execute({
      threadId,
      commentId,
      replyId,
      owner,
    });

    const response = h.response({
      status: "success",
      message: "berhasil menghapus balasan",
    });

    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
