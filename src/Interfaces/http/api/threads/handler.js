const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
// const GetThreadDetailsUseCase =
// require('../../../../Applications/use_case/GetThreadDetailsUseCase');
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");
const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/DeleteReplyUseCase");
const AddReplyUseCase = require("../../../../Applications/use_case/AddReplyUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentByIdHandler = this.deleteCommentByIdHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyByIdHandler = this.deleteReplyByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute(owner, request.payload);

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
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
