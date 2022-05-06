/* eslint-disable no-unused-vars */
class LikeRepository {
  async checkLiked(like) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async createLike(addReply) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async getLikeCountsByThreadId(threadId) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }

  async deleteLike(replyId) {
    throw new Error("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = LikeRepository;
