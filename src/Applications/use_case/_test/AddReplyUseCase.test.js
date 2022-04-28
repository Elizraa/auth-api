const CommentRepository = require("../../../Domains/threads/comment/CommentRepository");
const CreatedReply = require("../../../Domains/threads/reply/entities/CreatedReply");
const CreateReply = require("../../../Domains/threads/reply/entities/CreateReply");
const ReplyRepository = require("../../../Domains/threads/reply/ReplyRepository");
const AddReplyUseCase = require("../AddReplyUseCase");

describe("AddReplyUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the create reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      content: "Tentang cerita dulu",
      owner: "user-123",
    };

    const expectedCreatedReply = new CreatedReply({
      id: "reply-123",
      content: "Tentang cerita dulu",
      owner: "user-123",
    });

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockReplyRepository.addReply = jest.fn(() =>
      Promise.resolve(expectedCreatedReply)
    );
    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const createdThread = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(createdThread).toStrictEqual(expectedCreatedReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new CreateReply({
        commentId: "comment-123",
        content: "Tentang cerita dulu",
        owner: "user-123",
      })
    );
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(
      useCasePayload
    );
  });
});
