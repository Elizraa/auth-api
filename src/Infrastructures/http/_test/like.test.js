const Jwt = require("@hapi/jwt");
const pool = require("../../database/postgres/pool");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/likes endpoint", () => {
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

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    const threadId = "thread-123";
    it("should response 200 and persisted like comment", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(threadId, {});
      const commentId = await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");

      const likes = await LikesTableTestHelper.getLikesByCommentId({});
      expect(likes).toHaveLength(1);
    });

    it("should response 404 when reply is not exist", async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(threadId, {});
      const commentId = await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLike({});

      const server = await createServer(container);

      // Action

      const response = await server.inject({
        method: "PUT",
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");

      const likes = await LikesTableTestHelper.getLikesByCommentId({});
      expect(likes).toHaveLength(0);
    });
  });
});
