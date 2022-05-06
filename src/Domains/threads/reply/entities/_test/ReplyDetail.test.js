const ReplyDetail = require('../ReplyDetail');

describe('a ReplyDetail entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
        };

        // Action and Assert
        expect(() => new ReplyDetail(payload)).toThrowError(
            'REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY',
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            content: 'Content isi reply',
            date: '2021-08-08T07:19:09.775Z',
            username: [],
            is_deleted: {},
        };

        // Action and Assert
        expect(() => new ReplyDetail(payload)).toThrowError(
            'REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION',
        );
    });

    it('should create ReplyDetail object correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'Content isi reply',
            date: new Date('2021-08-08T07:19:09.775Z'),
            username: 'dicoding',
            is_deleted: false,
        };

        // Action
        const { id, content, date, username } = new ReplyDetail(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(content).toEqual(payload.content);
        expect(date).toEqual(payload.date.toISOString());
        expect(username).toEqual(payload.username);
    });

    it('should create ReplyDetail object when the content is deleted correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'Content isi reply',
            date: new Date('2021-08-08T07:19:09.775Z'),
            username: 'dicoding',
            is_deleted: true,
        };

        // Action
        const { id, content, date, username } = new ReplyDetail(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(content).toEqual('**balasan telah dihapus**');
        expect(date).toEqual(payload.date.toISOString());
        expect(username).toEqual(payload.username);
    });
});
