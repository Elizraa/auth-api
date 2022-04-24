const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const Jwt = require('@hapi/jwt')

describe('/threads endpoint', () => {

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  var accessToken;
  beforeEach(async () => {
    const adduserPayload = {
      id: 'user-123',
      username: 'dicoding',
      password: 'asd',
      fullname: 'Dicoding Indonesia',
    };

    await UsersTableTestHelper.addUser(adduserPayload);
    accessToken = newAccessToken = Jwt.token.generate(adduserPayload, process.env.ACCESS_TOKEN_KEY);
  })

  describe('when POST /threads', () => {

    it('should response 201 and persisted thread', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      const requestPayload = {
        title: 'title1',
        body: 'body1'
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload
      });
      
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
          title: 'dicoding',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: requestPayload,
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
          'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak lengkap',
      );
    })

    it('should response 401 when no access token given', async () => {
      // Arrange
      const requestPayload = {
          title: 'dicoding',
          body: 'abc',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
          method: 'POST',
          url: '/threads',
          payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });
  });

  describe('when POST /threads/{threadId}/comments', () => {
    var threadId = 'thread-123'
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
          content: 'Tentang cerita dulu',
      };
      await ThreadsTableTestHelper.addThread(threadId, {});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestPayload,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment).toHaveProperty(
          'content',
          'Tentang cerita dulu',
      );
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
       await ThreadsTableTestHelper.addThread(threadId, {});

      const server = await createServer(container);

      // Action

      const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestPayload,
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
          'tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak lengkap',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
          content: 123,
      };
       await ThreadsTableTestHelper.addThread(threadId, {});

      const server = await createServer(container);

      // Action

      const response = await server.inject({
          method: 'POST',
          url: `/threads/${threadId}/comments`,
          payload: requestPayload,
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
          'tidak dapat membuat komentar baru karena tipe data tidak sesuai',
      );
    });

    it('should response 404 when thread is not exist', async () => {
      // Arrange
      const requestPayload = {
          content: 'Tentang cerita dulu',
      };

      const server = await createServer(container);

      // Action

      const response = await server.inject({
          method: 'POST',
          url: '/threads/thread-123/comments',
          payload: requestPayload,
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    var threadId = 'thread-123'
    it('should response 200 and persisted delete comment', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread(threadId, {});
      const commentId = await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      // Action
      const response = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadId}/comments/${commentId}`,
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toEqual('berhasil menghapus komentar');
    });

    it('should response 404 when comment is not exist', async () => {
      // Arrange
       await ThreadsTableTestHelper.addThread(threadId, {});

      const server = await createServer(container);

      // Action

      const response = await server.inject({
          method: 'DELETE',
          url: `/threads/${threadId}/comments/comment-123`,
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });
  });
});
