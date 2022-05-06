const LikeUseCase = require("../../../../../Applications/use_case/LikeUseCase");

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.likeHandler = this.likeHandler.bind(this);
  }

  async likeHandler(request, h) {
    const { id: owner } = request.auth.credentials;

    const likeUseCase = this._container.getInstance(LikeUseCase.name);
    await likeUseCase.execute({ ...request.params, owner });

    const response = h.response({
      status: "success",
    });

    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
