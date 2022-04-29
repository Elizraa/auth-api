const InvariantError = require("../../../Commons/exceptions/InvariantError");
const DeleteReply = require("../../../Domains/threads/reply/entities/DeleteReply");
const ReplyRepository = require("../../../Domains/threads/reply/ReplyRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe("DeleteReplyUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the delete reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      commentId: "comment-123",
      replyId: "reply-123",
      owner: "user-123",
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.deleteReplyById = jest.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyExist = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action and Assert
    await expect(
      deleteReplyUseCase.execute(useCasePayload)
    ).resolves.not.toThrow(InvariantError);
    expect(mockReplyRepository.deleteReplyById).toBeCalledWith(
      new DeleteReply({
        commentId: "comment-123",
        replyId: "reply-123",
        owner: "user-123",
      })
    );
    expect(mockReplyRepository.verifyReplyExist).toBeCalledWith(useCasePayload);
  });
});
