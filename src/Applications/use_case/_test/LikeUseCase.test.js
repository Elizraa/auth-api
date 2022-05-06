const LikeUseCase = require("../LikeUseCase");
const CommentRepository = require("../../../Domains/threads/comment/CommentRepository");
const Like = require("../../../Domains/threads/like/entities/Like");
const LikeRepository = require("../../../Domains/threads/like/LikeRepository");

describe("LikeUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the like action correctly", async () => {
    // Arrange
    const useCasePayload = {
      commentId: "comment-123",
      owner: "user-123",
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
    mockLikeRepository.checkLiked = jest.fn(() => Promise.resolve([]));
    mockLikeRepository.createLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const likeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await likeUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(
      new Like({
        commentId: "comment-123",
        owner: "user-123",
      })
    );
    expect(mockLikeRepository.checkLiked).toBeCalledWith(
      new Like({
        commentId: "comment-123",
        owner: "user-123",
      })
    );
    expect(mockLikeRepository.createLike).toBeCalledWith(
      new Like({
        commentId: "comment-123",
        owner: "user-123",
      })
    );
  });

  it("should orchestrating the unlike action correctly", async () => {
    // Arrange
    const useCasePayload = {
      commentId: "comment-123",
      owner: "user-123",
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
    mockLikeRepository.checkLiked = jest.fn(() => Promise.resolve([{}]));
    mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const likeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await likeUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(
      new Like({
        commentId: "comment-123",
        owner: "user-123",
      })
    );
    expect(mockLikeRepository.checkLiked).toBeCalledWith(
      new Like({
        commentId: "comment-123",
        owner: "user-123",
      })
    );
    expect(mockLikeRepository.deleteLike).toBeCalledWith(
      new Like({
        commentId: "comment-123",
        owner: "user-123",
      })
    );
  });
});
