const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ForbiddenError = require("../../../Commons/exceptions/ForbiddenError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const CreatedReply = require("../../../Domains/threads/reply/entities/CreatedReply");
const CreateReply = require("../../../Domains/threads/reply/entities/CreateReply");
const DeleteReply = require("../../../Domains/threads/reply/entities/DeleteReply");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");

describe("ReplyRepositoryPostgres", () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe("verifyReplyExist function", () => {
    it("should throw NotFoundError when reply is not exist", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        replyRepositoryPostgres.verifyReplyExist("reply-123")
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError when reply is exist", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(undefined, {});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        replyRepositoryPostgres.verifyReplyExist({
          commentId: "comment-123",
          replyId: "reply-123",
        })
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("createReply function", () => {
    it("should persist create reply", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(undefined, {});
      await CommentsTableTestHelper.addComment({});
      const createReply = new CreateReply({
        commentId: "comment-123",
        content: "Content isi reply",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123"; // stub
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(createReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById("reply-123");
      expect(reply).toHaveLength(1);
      expect(reply[0]).toHaveProperty("id", "reply-123");
      expect(reply[0]).toHaveProperty("commentid", "comment-123");
      expect(reply[0]).toHaveProperty("content", "Content isi reply");
      expect(reply[0]).toHaveProperty("owner", "user-123");
      expect(reply[0]).toHaveProperty("is_deleted", false);
      expect(reply[0]).toHaveProperty("date");
    });

    it("should return created reply correctly", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(undefined, {});
      await CommentsTableTestHelper.addComment({});
      const createReply = new CreateReply({
        commentId: "comment-123",
        content: "Content isi reply",
        owner: "user-123",
      });

      const fageIdGenerator = () => "123"; // stub
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fageIdGenerator
      );

      // Action
      const createdReply = await replyRepositoryPostgres.addReply(createReply);

      // Assert
      expect(createdReply).toStrictEqual(
        new CreatedReply({
          id: "reply-123",
          content: "Content isi reply",
          owner: "user-123",
        })
      );
    });
  });

  describe("getRepliesByThreadId", () => {
    const threadId = "thread-123";
    it("should return empty replies if there is no replies in the thread", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(threadId, {});
      await CommentsTableTestHelper.addComment({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId({
        threadId,
      });

      // Assert
      expect(replies).toHaveLength(0);
    });

    it("should return replies correctly", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(threadId, {});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId({
        threadId,
      });

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies[0]).toHaveProperty("id", "reply-123");
      expect(replies[0]).toHaveProperty("is_deleted", false);
      expect(replies[0]).toHaveProperty("commentid", "comment-123");
      expect(replies[0]).toHaveProperty("content", "Content isi reply");
      expect(replies[0]).toHaveProperty("username", "dicoding");
      expect(replies[0]).toHaveProperty("date");
    });
  });

  describe("deleteReplyById function", () => {
    it("should persist delete reply detail", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(undefined, {});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const deleteReply = new DeleteReply({
        commentId: "comment-123",
        replyId: "reply-123",
        owner: "user-123",
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        replyRepositoryPostgres.deleteReplyById(deleteReply)
      ).resolves.not.toThrow(ForbiddenError);
      const reply = await RepliesTableTestHelper.findReplyById("reply-123");
      expect(reply).toHaveLength(1);
      expect(reply[0]).toHaveProperty("is_deleted", true);
    });

    it("should throw ForbiddenError when the access user is not the owner", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(undefined, {});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const deleteReply = new DeleteReply({
        commentId: "comment-123",
        replyId: "reply-123",
        owner: "user-124",
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        replyRepositoryPostgres.deleteReplyById(deleteReply)
      ).rejects.toThrow(ForbiddenError);
      const reply = await RepliesTableTestHelper.findReplyById("reply-123");
      expect(reply).toHaveLength(1);
    });
  });
});
