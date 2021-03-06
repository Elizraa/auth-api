const DeleteCommentUseCase = require("../../../../../Applications/use_case/DeleteCommentUseCase");
const AddCommentUseCase = require("../../../../../Applications/use_case/AddCommentUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { content } = request.payload;
    const { id: owner } = request.auth.credentials;
    const { threadId } = request.params;

    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const addedComment = await addCommentUseCase.execute({
      content,
      owner,
      threadId,
    });
    const response = h.response({
      status: "success",
      message: "berhasil menambahkan komentar",
      data: {
        addedComment,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCommentByIdHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    await deleteCommentUseCase.execute({ threadId, commentId, owner });

    const response = h.response({
      status: "success",
      message: "berhasil menghapus komentar",
    });

    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
