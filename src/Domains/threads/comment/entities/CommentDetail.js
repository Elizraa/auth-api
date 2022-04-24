/* eslint-disable camelcase */
class CommentDetail {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, content, date, username, is_deleted, replies } = payload;

        this.id = id;
        this.content = is_deleted ? '**komentar telah dihapus**' : content;
        this.date = date;
        this.username = username;
        this.replies = replies;
    }

    _verifyPayload({ id, content, date, username, is_deleted, replies }) {
        if (!id || !content || !date || !username || !replies) {
            throw new Error('COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string' ||
            typeof content !== 'string' ||
            typeof date !== 'string' ||
            typeof username !== 'string' ||
            typeof is_deleted !== 'boolean' ||
            !(replies instanceof Array)
        ) {
            throw new Error('COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CommentDetail;
