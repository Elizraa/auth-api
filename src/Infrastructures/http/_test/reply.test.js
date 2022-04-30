const Jwt = require("@hapi/jwt");
const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/threads endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  let accessToken;
  beforeEach(async () => {
    const adduserPayload = {
      id: "user-123",
      username: "dicoding",
      password: "asd",
      fullname: "Dicoding Indonesia",
    };

    await UsersTableTestHelper.addUser(adduserPayload);
    const newAccessToken = Jwt.token.generate(
      adduserPayload,
      process.env.ACCESS_TOKEN_KEY
    );
    accessToken = newAccessToken;
  });

  describe("when POST /threads/{threadId}/comments/{commentId}/replies", () => {
    const threadId = "thread-123";
    it("should response 201 and persisted reply", async () => {
      // Arrange
      const requestPayload = {
        content: "Content isi reply",
      };
      await ThreadsTableTestHelper.addThread(threadId, {});
      const commentId = "comment-123";
      await CommentsTableTestHelper.addComment({ id: commentId });
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply).toHaveProperty(
        "content",
        "Content isi reply"
      );
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {};
      await ThreadsTableTestHelper.addThread(threadId, {});
      const commentId = await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      // Action

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak lengkap"
      );
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };
      await ThreadsTableTestHelper.addThread(threadId, {});
      const commentId = await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      // Action

      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat balasan baru karena tipe data tidak sesuai"
      );
    });

    it("should response 404 when comment is not exist", async () => {
      // Arrange
      const requestPayload = {
        content: "Content isi reply",
      };
      const server = await createServer(container);

      // Action

      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments/comment-123/replies",
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("komentar tidak ditemukan");
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
    const threadId = "thread-123";
    it("should response 200 and persisted delete reply", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(threadId, {});
      const commentId = await CommentsTableTestHelper.addComment({});
      const replyId = await RepliesTableTestHelper.addReply({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.message).toEqual("berhasil menghapus balasan");
    });

    it("should response 404 when reply is not exist", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(threadId, {});
      const commentId = await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      // Action

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/reply-123`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("balasan tidak ditemukan");
    });
  });
});
