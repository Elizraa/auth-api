/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const LikesTableTestHelper = {
  async addLike({
    id = "like-123",
    commentId = "comment-123",
    owner = "user-123",
  }) {
    const query = {
      text: "INSERT INTO likes VALUES($1, $2, $3)",
      values: [id, commentId, owner],
    };

    await pool.query(query);
  },

  async deleteLike({ id = "like-123" }) {
    const query = {
      text: "DELETE FROM likes WHERE id = $1",
      values: [id],
    };

    await pool.query(query);
  },

  async findLikeById(id) {
    const query = {
      text: "SELECT * FROM likes WHERE id = $1",
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rowCount) return result.rows;
    result.rows[0].owner = result.rows[0].user_id;
    delete result.rows[0].user_id;
    return result.rows;
  },

  async getLikesByCommentId({ commentId = "comment-123" }) {
    const query = {
      text: "SELECT * FROM likes WHERE comment_id = $1",
      values: [commentId],
    };
    const result = await pool.query(query);
    if (!result.rowCount) return result.rows;
    result.rows[0].owner = result.rows[0].user_id;
    delete result.rows[0].user_id;
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM likes");
  },
};

module.exports = LikesTableTestHelper;
