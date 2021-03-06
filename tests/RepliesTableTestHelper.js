/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const RepliesTableTestHelper = {
  async addReply({
    id = "reply-123",
    commentId = "comment-123",
    content = "Content isi reply",
    owner = "user-123",
  }) {
    const query = {
      text: "INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, commentId, owner, content],
    };

    const results = await pool.query(query);
    return results.rows[0].id;
  },

  async deleteReply({ id = "reply-123", owner = "user-123" }) {
    const query = {
      text: "UPDATE replies SET is_deleted = true WHERE id = $1 AND userid = $2 RETURNING id",
      values: [id, owner],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: "SELECT * FROM replies WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    result.rows[0].owner = result.rows[0].userid;
    delete result.rows[0].userid;
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM replies");
  },
};

module.exports = RepliesTableTestHelper;
