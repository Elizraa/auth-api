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

  describe("when POST /threads", () => {
    it("should response 201 and persisted thread", async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const requestPayload = {
        title: "title1",
        body: "body1",
      };

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const requestPayload = {
        title: "dicoding",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
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
        "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak lengkap"
      );
    });

    it("should response 401 when no access token given", async () => {
      // Arrange
      const requestPayload = {
        title: "dicoding",
        body: "abc",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
    });
  });

  describe("when GET /threads/{threadId}", () => {
    const threadId = "thread-123";
    it("should response 200 and persisted thread details without comments", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(threadId, {});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread).toHaveProperty("id", "thread-123");
      expect(responseJson.data.thread).toHaveProperty("title", "dicoding");
      expect(responseJson.data.thread).toHaveProperty("body", "abc");
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread).toHaveProperty("username", "dicoding");
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(0);
    });

    it("should response 200 and persisted thread details with comments", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(threadId, {});
      await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread).toHaveProperty("id", "thread-123");
      expect(responseJson.data.thread).toHaveProperty("title", "dicoding");
      expect(responseJson.data.thread).toHaveProperty("body", "abc");
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread).toHaveProperty("username", "dicoding");
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "id",
        "comment-123"
      );
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "content",
        "Content isi comment"
      );
      expect(responseJson.data.thread.comments[0].date).toBeDefined();
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "username",
        "dicoding"
      );
      expect(responseJson.data.thread.comments[0].replies).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(0);
    });

    it("should response 200 and persisted thread details with comments and replies", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(threadId, {});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread).toHaveProperty("id", "thread-123");
      expect(responseJson.data.thread).toHaveProperty("title", "dicoding");
      expect(responseJson.data.thread).toHaveProperty("body", "abc");
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread).toHaveProperty("username", "dicoding");
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "id",
        "comment-123"
      );
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "content",
        "Content isi comment"
      );
      expect(responseJson.data.thread.comments[0].date).toBeDefined();
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "username",
        "dicoding"
      );
      expect(responseJson.data.thread.comments[0].replies).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].replies[0]).toHaveProperty(
        "id",
        "reply-123"
      );
      expect(responseJson.data.thread.comments[0].replies[0]).toHaveProperty(
        "content",
        "Content isi reply"
      );
      expect(responseJson.data.thread.comments[0].replies[0]).toHaveProperty(
        "date"
      );
      expect(responseJson.data.thread.comments[0].replies[0]).toHaveProperty(
        "username",
        "dicoding"
      );
    });

    it("should response 200 and persisted thread details with deleted comments and exist replies", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(threadId, {});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      await CommentsTableTestHelper.deleteComment({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread).toHaveProperty("id", "thread-123");
      expect(responseJson.data.thread).toHaveProperty("title", "dicoding");
      expect(responseJson.data.thread).toHaveProperty("body", "abc");
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread).toHaveProperty("username", "dicoding");
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "id",
        "comment-123"
      );
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "content",
        "**komentar telah dihapus**"
      );
      expect(responseJson.data.thread.comments[0].date).toBeDefined();
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "username",
        "dicoding"
      );
      expect(responseJson.data.thread.comments[0].replies).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].replies[0]).toHaveProperty(
        "id",
        "reply-123"
      );
      expect(responseJson.data.thread.comments[0].replies[0]).toHaveProperty(
        "content",
        "Content isi reply"
      );
      expect(
        responseJson.data.thread.comments[0].replies[0].date
      ).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies[0]).toHaveProperty(
        "username",
        "dicoding"
      );
    });

    it("should response 200 and persisted thread details with exist comments and deleted replies", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(threadId, {});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      await RepliesTableTestHelper.deleteReply({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread).toHaveProperty("id", "thread-123");
      expect(responseJson.data.thread).toHaveProperty("title", "dicoding");
      expect(responseJson.data.thread).toHaveProperty("body", "abc");
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread).toHaveProperty("username", "dicoding");
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "id",
        "comment-123"
      );
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "content",
        "Content isi comment"
      );
      expect(responseJson.data.thread.comments[0].date).toBeDefined();
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "username",
        "dicoding"
      );
      expect(responseJson.data.thread.comments[0].replies).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].replies[0]).toHaveProperty(
        "id",
        "reply-123"
      );
      expect(responseJson.data.thread.comments[0].replies[0]).toHaveProperty(
        "content",
        "**balasan telah dihapus**"
      );
      expect(
        responseJson.data.thread.comments[0].replies[0].date
      ).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies[0]).toHaveProperty(
        "username",
        "dicoding"
      );
    });

    it("should response 200 and persisted thread details with deleted comments and deleted replies", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(threadId, {});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      await CommentsTableTestHelper.deleteComment({});
      await RepliesTableTestHelper.deleteReply({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread).toHaveProperty("id", "thread-123");
      expect(responseJson.data.thread).toHaveProperty("title", "dicoding");
      expect(responseJson.data.thread).toHaveProperty("body", "abc");
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread).toHaveProperty("username", "dicoding");
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "id",
        "comment-123"
      );
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "content",
        "**komentar telah dihapus**"
      );
      expect(responseJson.data.thread.comments[0].date).toBeDefined();
      expect(responseJson.data.thread.comments[0]).toHaveProperty(
        "username",
        "dicoding"
      );
      expect(responseJson.data.thread.comments[0].replies).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].replies[0]).toHaveProperty(
        "id",
        "reply-123"
      );
      expect(responseJson.data.thread.comments[0].replies[0]).toHaveProperty(
        "content",
        "**balasan telah dihapus**"
      );
      expect(
        responseJson.data.thread.comments[0].replies[0].date
      ).toBeDefined();
      expect(responseJson.data.thread.comments[0].replies[0]).toHaveProperty(
        "username",
        "dicoding"
      );
    });

    it("should response 404 when thread is not exist", async () => {
      // Arrange

      const server = await createServer(container);

      // Action

      const response = await server.inject({
        method: "GET",
        url: "/threads/thread-123",
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual("thread tidak ditemukan");
    });
  });
});
