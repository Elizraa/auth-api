const ThreadsTableTestHelper = require('../../../../tests/threadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/usersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NewThread = require('../../../Domains/threads/thread/entities/NewThread');
const CreatedThread = require('../../../Domains/threads/thread/entities/CreatedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return created thread correctly', async () => {
      // Arrange
      const newThread = new NewThread('user-123', {
        title: 'dicoding',
        body: 'abc'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({ id: 'user-123' }); // memasukan user baru dengan username dicoding
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return registered thread correctly', async () => {
      // Arrange
      const newThread = new NewThread('user-123',{
        title: 'dicoding',
        body: 'abc'
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({ id: 'user-123' }); // memasukan user baru dengan username dicoding
      const createdThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-123',
      }));
    });
  });

  describe('getThreadDetailById', () => {
    it('should throw InvariantError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.getThreadDetailById('thread-321'))
        .rejects
        .toThrowError(InvariantError);
    });

    it('should return detail when thread is found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await UsersTableTestHelper.addUser({ id: 'user-123' }); // memasukan user baru dengan username dicoding
      const newThread = new NewThread('user-123',{
        title: 'dicoding',
        body: 'abc'
      });
      await threadRepositoryPostgres.addThread(newThread);

      // Action & Assert
      const detail = await threadRepositoryPostgres.getThreadDetailById('thread-123');
      expect(detail.body).toBe('abc');
    });
  });
});
