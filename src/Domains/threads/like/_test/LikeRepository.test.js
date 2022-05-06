const LikeRepository = require("../LikeRepository");

describe("LikeRepository interface", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(likeRepository.checkLiked({})).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(likeRepository.createLike({})).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(
      likeRepository.getLikeCountsByThreadId({})
    ).rejects.toThrowError("LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED");

    await expect(likeRepository.deleteLike({})).rejects.toThrowError(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
