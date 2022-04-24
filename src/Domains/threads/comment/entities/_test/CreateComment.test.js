const CreateComment = require('../CreateComment');

describe('an CreateComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'Tentang cerita dulu',
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new CreateComment(payload)).toThrowError(
            'CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            threadId: ['thread-123'],
            content: 123,
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new CreateComment(payload)).toThrowError(
            'CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
        );
    });

    it('should create createComment object correctly', () => {
        // Arrange
        const payload = {
            threadId: 'thread-123',
            content: 'Tentang cerita dulu',
            owner: 'user-123',
        };

        // Action
        const { content, threadId, owner } = new CreateComment(payload);

        // Assert
        expect(content).toEqual(payload.content);
        expect(threadId).toEqual(payload.threadId);
        expect(owner).toEqual(payload.owner);
    });
});
