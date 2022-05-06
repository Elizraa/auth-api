const InvariantError = require("../../Commons/exceptions/InvariantError");
const CreatedThread = require("../../Domains/threads/thread/entities/CreatedThread");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ThreadRepository = require("../../Domains/threads/thread/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { owner, title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, owner, body, title],
    };
    await this._pool.query(query);
    return new CreatedThread({ id, title, owner });
  }

  async getThreadDetailsById({ threadId }) {
    const query = {
      text: `SELECT t.id, t.title, t.body, date, u.username
      FROM threads t
      JOIN users u ON t.userid = u.id
      WHERE t.id = $1`,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("thread tidak ditemukan");
    }

    return result.rows[0];
  }

  async verifyThreadExist(threadId) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [threadId],
    };

    const results = await this._pool.query(query);

    if (!results.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }
}

module.exports = ThreadRepositoryPostgres;
