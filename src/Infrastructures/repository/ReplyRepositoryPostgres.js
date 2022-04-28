/* eslint-disable no-tabs */
const ReplyRepository = require("../../Domains/threads/reply/ReplyRepository");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ForbiddenError = require("../../Commons/exceptions/ForbiddenError");
const CreatedReply = require("../../Domains/threads/reply/entities/CreatedReply");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyReplyExist({ commentId, replyId }) {
    const query = {
      text: "SELECT id FROM replies WHERE id = $1 AND commentid = $2",
      values: [replyId, commentId],
    };

    const results = await this._pool.query(query);

    if (!results.rowCount) {
      throw new NotFoundError("balasan tidak ditemukan");
    }
  }

  async addReply(createReply) {
    const { commentId, content, owner } = createReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, userid",
      values: [id, commentId, owner, content],
    };

    const result = await this._pool.query(query);
    result.rows[0].owner = result.rows[0].userid;
    delete result.rows[0].userid;
    return new CreatedReply({ ...result.rows[0] });
  }

  async getRepliesByThreadId({ threadId }) {
    const query = {
      text: `	SELECT
						r.id,
						r.commentid,
						r.date,
						r.is_deleted,
						r.content,
						u.username
					FROM replies r
					JOIN users u ON r.userid = u.id
					JOIN comments c ON r.commentid = c.id
					WHERE c.threadid = $1
					ORDER BY r.date ASC`,
      values: [threadId],
    };

    const results = await this._pool.query(query);
    return results.rows;
  }

  async deleteReplyById({ replyId, owner }) {
    const query = {
      text: "UPDATE replies SET is_deleted = true WHERE id = $1 AND userid = $2 RETURNING id",
      values: [replyId, owner],
    };

    const results = await this._pool.query(query);
    if (!results.rowCount) {
      throw new ForbiddenError("anda tidak berhak menghapus balasan ini");
    }
  }
}

module.exports = ReplyRepositoryPostgres;
