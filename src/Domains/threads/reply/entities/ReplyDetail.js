/* eslint-disable camelcase */
class ReplyDetail {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, content, date, username, is_deleted } = payload;

        this.id = id;
        this.content = is_deleted ? '**balasan telah dihapus**' : content;
        this.date = date;
        this.username = username;
    }

    _verifyPayload({ id, content, date, username, is_deleted }) {
        if (!id || !content || !date || !username) {
            throw new Error('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string' ||
            typeof content !== 'string' ||
            typeof date !== 'string' ||
            typeof username !== 'string' ||
            typeof is_deleted !== 'boolean'
        ) {
            throw new Error('REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ReplyDetail;
