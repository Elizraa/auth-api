/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({
        id = 'comment-123',
        threadId = 'thread-123',
        content = 'Tentang cerita dulu',
        owner = 'user-123',
    }) {
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, threadId, owner, content],
        };

        const results = await pool.query(query);
        return results.rows[0].id;
    },

    async deleteComment({ id = 'comment-123', owner = 'user-123' }) {
        const query = {
            text: 'UPDATE comments SET is_deleted = true WHERE id = $1 AND userId = $2 RETURNING id',
            values: [id, owner],
        };

        await pool.query(query);
    },

    async findCommentById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        result.rows[0].owner = result.rows[0].userid
        delete result.rows[0].userid
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments');
    },
};

module.exports = CommentsTableTestHelper;
