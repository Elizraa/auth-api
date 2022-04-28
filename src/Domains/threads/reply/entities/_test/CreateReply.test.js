const CreateReply = require('../CreateReply');

describe('an CreateReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'Content isi reply',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new CreateReply(payload)).toThrowError(
            'CREATE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            commentId: ['comment-123'],
            content: 123,
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new CreateReply(payload)).toThrowError(
            'CREATE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
        );
    });

    it('should create createReply object correctly', () => {
        // Arrange
        const payload = {
            commentId: 'reply-123',
            content: 'Content isi reply',
            owner: 'user-123',
        };

        // Action
        const { content, commentId, owner } = new CreateReply(payload);

        // Assert
        expect(content).toEqual(payload.content);
        expect(commentId).toEqual(payload.commentId);
        expect(owner).toEqual(payload.owner);
    });
});
