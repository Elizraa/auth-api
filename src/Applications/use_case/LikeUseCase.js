const Like = require("../../Domains/threads/like/entities/Like");

class LikeUseCase {
  constructor({ likeRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const like = new Like(useCasePayload);

    await this._commentRepository.verifyCommentExist(useCasePayload);
    const liked = await this._likeRepository.checkLiked(like);

    if (liked.length === 0) {
      await this._likeRepository.createLike(useCasePayload);
    } else {
      await this._likeRepository.deleteLike(useCasePayload);
    }
  }
}

module.exports = LikeUseCase;
