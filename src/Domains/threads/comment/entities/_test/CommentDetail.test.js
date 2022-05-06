const CommentDetail = require('../CommentDetail');

describe('a CommentDetail entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
        };

        // Action and Assert
        expect(() => new CommentDetail(payload)).toThrowError(
            'COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY',
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            content: 'Content isi comment',
            date: new Date('2022-05-05T09:10:15.251Z'),
            username: [],
            is_deleted: '',
            likeCount: '',
            replies: {},
        };

        // Action and Assert
        expect(() => new CommentDetail(payload)).toThrowError(
            'COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION',
        );
    });

    it('should create CommentDetail object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'Content isi comment',
            date: new Date('2022-05-05T09:10:15.251Z'),
            username: 'dicoding',
            is_deleted: false,
            likeCount: '',
            replies: [],
        };

        // Action
        const { id, content, date, username, replies } = new CommentDetail(
            payload,
        );

        // Assert
        expect(id).toEqual(payload.id);
        expect(content).toEqual(payload.content);
        expect(date).toEqual(payload.date.toISOString());
        expect(username).toEqual(payload.username);
        expect(replies).toStrictEqual(payload.replies);
    });

    it('should create CommentDetail object when the content is deleted correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'Content isi comment',
            date: new Date('2022-05-05T09:10:15.251Z'),
            username: 'dicoding',
            is_deleted: true,
            likeCount: '',
            replies: [],
        };

        // Action
        const { id, content, date, username, replies } = new CommentDetail(
            payload,
        );

        // Assert
        expect(id).toEqual(payload.id);
        expect(content).toEqual('**komentar telah dihapus**');
        expect(date).toEqual(payload.date.toISOString());
        expect(username).toEqual(payload.username);
        expect(replies).toStrictEqual(payload.replies);
    });
});
