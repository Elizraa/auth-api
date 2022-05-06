/* eslint-disable no-tabs */
const LikeRepository = require("../../Domains/threads/like/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async checkLiked({ commentId, owner }) {
    const query = {
      text: "SELECT id FROM likes WHERE comment_id = $1 AND user_id = $2",
      values: [commentId, owner],
    };

    const results = await this._pool.query(query);

    return results.rows;
  }

  async addLike({ commentId, owner }) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO likes VALUES($1, $2, $3)",
      values: [id, commentId, owner],
    };

    await this._pool.query(query);
  }

  async getLikeCountsByThreadId({ threadId }) {
    const query = {
      text: `SELECT
            l.comment_id,
            COUNT(l.id) AS like_count
            FROM likes l
            JOIN comments c ON c.id = l.comment_id
            JOIN threads t ON t.id = c.threadid
            WHERE t.id = $1
            GROUP by l.comment_id`,
      values: [threadId],
    };

    const results = await this._pool.query(query);

    return results.rows;
  }

  async deleteLike({ commentId, owner }) {
    const query = {
      text: "DELETE FROM likes WHERE comment_id = $1 AND user_id = $2",
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }
}

module.exports = LikeRepositoryPostgres;
