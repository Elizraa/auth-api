/* eslint-disable import/no-unresolved */
const ThreadsTableTestHelper = require("../../../../tests/threadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/usersTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const CreateThread = require("../../../Domains/threads/thread/entities/CreateThread");
const CreatedThread = require("../../../Domains/threads/thread/entities/CreatedThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist new thread and return created thread correctly", async () => {
      // Arrange
      const newThread = new CreateThread("user-123", {
        title: "dicoding",
        body: "abc",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await UsersTableTestHelper.addUser({ id: "user-123" }); // memasukan user baru dengan username dicoding
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById("thread-123");
      expect(threads).toHaveLength(1);
    });

    it("should return registered thread correctly", async () => {
      // Arrange
      const newThread = new CreateThread("user-123", {
        title: "dicoding",
        body: "abc",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await UsersTableTestHelper.addUser({ id: "user-123" }); // memasukan user baru dengan username dicoding
      const createdThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(createdThread).toStrictEqual(
        new CreatedThread({
          id: "thread-123",
          title: "dicoding",
          owner: "user-123",
        })
      );
    });
  });

  describe("getThreadDetaislById", () => {
    it("should throw InvariantError when thread not found", () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        threadRepositoryPostgres.getThreadDetailsById("thread-321")
      ).rejects.toThrowError(InvariantError);
    });

    it("should return detail when thread is found", async () => {
      // Arrange
      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await UsersTableTestHelper.addUser({ id: "user-123" }); // memasukan user baru dengan username dicoding
      const newThread = new CreateThread("user-123", {
        title: "dicodingThread",
        body: "abc",
      });
      await threadRepositoryPostgres.addThread(newThread);
      // Action & Assert
      const detail = await threadRepositoryPostgres.getThreadDetailsById({
        threadId: "thread-123",
      });
      expect(detail).toHaveProperty("id", "thread-123");
      expect(detail).toHaveProperty("title", "dicodingThread");
      expect(detail).toHaveProperty("body", "abc");
      expect(detail).toHaveProperty("username", "dicoding");
      expect(detail).toHaveProperty("date");
    });
  });

  describe("verifyThreadExist function", () => {
    it("should throw NotFoundError when thread is not exist", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        threadRepositoryPostgres.verifyThreadExist("thread-123")
      ).rejects.toThrow(NotFoundError);
    });

    it("should not throw NotFoundError when thread is exist", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread("thread-123", {});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(
        threadRepositoryPostgres.verifyThreadExist("thread-123")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
