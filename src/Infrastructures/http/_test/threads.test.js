const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    var accessToken;
    beforeEach(async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken: newAccessToken } } = JSON.parse(loginResponse.payload);
      accessToken = newAccessToken
    })

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
      expect(responseJson.data.addedThread.id).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
          title: 'dicoding',
      };
      // const accessToken = await ServerTestHelper.getAccessToken();

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
});
