class ThreadDetails {
    constructor(payload) {
        this._verifyPayload(payload);

        this.id = payload.id;
        this.title = payload.title;
        this.body = payload.body;
        this.date = payload.date.toString();
        this.username = payload.username;
        this.comments = payload.comments;
    }

    _verifyPayload({ id, title, body, date, username, comments }) {
        if (!id || !title || !body || !date || !username || !comments) {
            throw new Error('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        const dateString = date.toString();
        if (
            typeof id !== 'string' ||
            typeof title !== 'string' ||
            typeof body !== 'string' ||
            typeof dateString !== 'string' ||
            typeof username !== 'string' ||
            !(comments instanceof Array)
        ) {
            throw new Error('THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ThreadDetails;
