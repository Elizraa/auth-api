const CreatedReply = require('../CreatedReply');

describe('an CreatedReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'Content isi reply',
        };

        // Action and Assert
        expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            content: [],
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new CreatedReply(payload)).toThrowError('CREATED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create CreatedReply object correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'Content isi reply',
            owner: 'user-123',
        };

        // Action
        const { id, content, owner } = new CreatedReply(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
    });
});
