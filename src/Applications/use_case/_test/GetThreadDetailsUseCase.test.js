const CommentRepository = require("../../../Domains/threads/comment/CommentRepository");
const CommentDetail = require("../../../Domains/threads/comment/entities/CommentDetail");
const ReplyDetail = require("../../../Domains/threads/reply/entities/ReplyDetail");
const ReplyRepository = require("../../../Domains/threads/reply/ReplyRepository");
const GetThreadDetails = require("../../../Domains/threads/thread/entities/GetThreadDetails");
const ThreadDetails = require("../../../Domains/threads/thread/entities/ThreadDetails");
const ThreadRepository = require("../../../Domains/threads/thread/ThreadRepository");
const GetThreadDetailsUseCase = require("../GetThreadDetailsUseCase");
const LikeRepository = require("../../../Domains/threads/like/LikeRepository");

describe("GetThreadDetailsUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the get thread details action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };

    const expectedThreadDetails = new ThreadDetails({
      id: "thread-123",
      title: "Judul thread",
      body: "Body thread",
      date: new Date("2022-05-05T09:10:15.251Z"),
      username: "dicoding",
      comments: [
        new CommentDetail({
          id: "comment-123",
          content: "Content isi comment",
          date: new Date("2022-05-05T09:10:15.251Z"),
          username: "dicoding",
          likeCount: 2,
          is_deleted: false,
          replies: [
            new ReplyDetail({
              id: "reply-123",
              content: "Content isi reply",
              date: new Date("2022-05-05T09:10:15.251Z"),
              username: "dicoding",
              is_deleted: true,
            }),
          ],
        }),
        new CommentDetail({
          id: "comment-124",
          content: "Content isi comment",
          date: new Date("2022-05-05T09:10:15.251Z"),
          username: "dicoding",
          likeCount: 0,
          is_deleted: true,
          replies: [
            new ReplyDetail({
              id: "reply-124",
              content: "Content isi reply",
              date: new Date("2022-05-05T09:10:15.251Z"),
              username: "dicoding",
              is_deleted: false,
            }),
          ],
        }),
      ],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetailsById = jest.fn(() =>
      Promise.resolve({
        id: "thread-123",
        title: "Judul thread",
        body: "Body thread",
        date: new Date("2022-05-05T09:10:15.251Z"),
        username: "dicoding",
      })
    );
    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());

    mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
      Promise.resolve([
        {
          id: "comment-123",
          thread_id: "thread-123",
          content: "Content isi comment",
          date: new Date("2022-05-05T09:10:15.251Z"),
          username: "dicoding",
          is_deleted: false,
        },
        {
          id: "comment-124",
          thread_id: "thread-123",
          content: "Content isi comment",
          date: new Date("2022-05-05T09:10:15.251Z"),
          username: "dicoding",
          is_deleted: true,
        },
      ])
    );

    mockReplyRepository.getRepliesByThreadId = jest.fn(() =>
      Promise.resolve([
        {
          id: "reply-123",
          commentid: "comment-123",
          content: "Content isi reply",
          date: new Date("2022-05-05T09:10:15.251Z"),
          username: "dicoding",
          is_deleted: true,
        },
        {
          id: "reply-124",
          commentid: "comment-124",
          content: "Content isi reply",
          date: new Date("2022-05-05T09:10:15.251Z"),
          username: "dicoding",
          is_deleted: false,
        },
      ])
    );

    mockLikeRepository.getLikeCountsByThreadId = jest.fn(() =>
      Promise.resolve([
        {
          comment_id: "comment-123",
          like_count: 2,
        },
      ])
    );

    /** creating use case instance */
    const getThreadUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const threadDetails = await getThreadUseCase.execute(useCasePayload);
    // Assert
    expect(threadDetails).toStrictEqual(expectedThreadDetails);
    expect(mockThreadRepository.getThreadDetailsById).toBeCalledWith(
      new GetThreadDetails({
        threadId: "thread-123",
      })
    );
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith("thread-123");
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      new GetThreadDetails({
        threadId: "thread-123",
      })
    );
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
      new GetThreadDetails({
        threadId: "thread-123",
      })
    );
    expect(mockLikeRepository.getLikeCountsByThreadId).toBeCalledWith(
      new GetThreadDetails({
        threadId: "thread-123",
      })
    );
  });
});
