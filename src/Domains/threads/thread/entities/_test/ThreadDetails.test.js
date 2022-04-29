const ThreadDetails = require('../ThreadDetails');

describe('a ThreadDetails entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
        };

        // Action and Assert
        expect(() => new ThreadDetails(payload)).toThrowError('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            title: 'Di atas Awan',
            body: 12.34,
            date: '2021-08-08T07:19:09.775Z',
            username: [],
            comments: {},
        };

        // Action and Assert
        expect(() => new ThreadDetails(payload)).toThrowError(
            'THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION',
        );
    });

    it('should create ThreadDetails object correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'Di atas Awan',
            body: 'Ku ingin terbang',
            date: '2021-08-08T07:19:09.775Z',
            username: 'dicoding',
            comments: [],
        };

        // Action
        const {
            id, title, body, date, username, comments,
        } = new ThreadDetails(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(date).toEqual(payload.date);
        expect(username).toEqual(payload.username);
        expect(comments).toStrictEqual(payload.comments);
    });
});
