/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async addReply({
        id = 'reply-123',
        commentId = 'comment-123',
        content = 'Hai, apa kabar',
        owner = 'user-123',
    }) {
        const query = {
            text: 'INSERT INTO replies(id, comment_id, content, owner, date) VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, commentId, content, owner, new Date().toISOString()],
        };

        const results = await pool.query(query);
        return results.rows[0].id;
    },

    async deleteReply({ id = 'reply-123', owner = 'user-123' }) {
        const query = {
            text: 'UPDATE replies SET is_deleted = true WHERE id = $1 AND owner = $2 RETURNING id',
            values: [id, owner],
        };

        await pool.query(query);
    },

    async findReplyById(id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM replies');
    },
};

module.exports = RepliesTableTestHelper;
