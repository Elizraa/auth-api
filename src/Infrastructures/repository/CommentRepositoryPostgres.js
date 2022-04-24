/* eslint-disable no-tabs */
const CommentRepository = require('../../Domains/threads/comment/CommentRepository');
const CreatedComment = require('../../Domains/threads/comment/entities/CreatedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ForbiddenError = require('../../Commons/exceptions/ForbiddenError');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async verifyCommentExist({ threadId, commentId }) {
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1 AND threadId = $2',
            values: [commentId, threadId],
        };

        const results = await this._pool.query(query);

        if (!results.rowCount) {
            throw new NotFoundError('komentar tidak ditemukan');
        }
    }

    async addComment(createComment) {
        const { threadId, content, owner } = createComment;
        const id = `comment-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, userId',
            values: [id, threadId, owner, content],
        };

        const result = await this._pool.query(query);
        result.rows[0].owner = result.rows[0].userid
        delete result.rows[0].userid
        return new CreatedComment({ ...result.rows[0] });
    }

    async getCommentsByThreadId({ threadId }) {
        const query = {
            text: `	SELECT
						c.id,
						c.threadId,
						c.date,
						c.is_deleted,
						c.content,
						u.username
					FROM comments c
					JOIN users u ON c.userId = u.id
					JOIN threads t ON c.threadId = t.id
					WHERE c.threadId = $1
					ORDER BY c.date ASC`,
            values: [threadId],
        };

        const results = await this._pool.query(query);

        return results.rows;
    }

    async deleteCommentById({ commentId, owner }) {
        const query = {
            text: 'UPDATE comments SET is_deleted = true WHERE id = $1 AND userId = $2 RETURNING id',
            values: [commentId, owner],
        };

        const results = await this._pool.query(query);
        if (!results.rowCount) {
            throw new ForbiddenError(
                'anda tidak berhak menghapus komentar ini',
            );
        }
    }
}

module.exports = CommentRepositoryPostgres;
