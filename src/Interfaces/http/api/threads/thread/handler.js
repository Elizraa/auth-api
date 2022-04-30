const AddThreadUseCase = require("../../../../../Applications/use_case/AddThreadUseCase");
const GetThreadDetailsUseCase = require("../../../../../Applications/use_case/GetThreadDetailsUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
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

  async getThreadByIdHandler(requet, h) {
    const { threadId } = requet.params;
    const getThreadDetailsUseCase = this._container.getInstance(
      GetThreadDetailsUseCase.name
    );
    const thread = await getThreadDetailsUseCase.execute({ threadId });
    const response = h.response({
      status: "success",
      message: "berhasil mendapatkan rincian thread",
      data: {
        thread,
      },
    });

    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
