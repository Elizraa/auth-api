const Like = require('../Like');

describe('an Like entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new Like(payload)).toThrowError(
            'LIKE.NOT_CONTAIN_NEEDED_PROPERTY',
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            commentId: ['comment-123'],
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new Like(payload)).toThrowError(
            'LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION',
        );
    });

    it('should create Like object correctly', () => {
        // Arrange
        const payload = {
            commentId: 'reply-123',
            owner: 'user-123',
        };

        // Action
        const { commentId, owner } = new Like(payload);

        // Assert
        expect(commentId).toEqual(payload.commentId);
        expect(owner).toEqual(payload.owner);
    });
});
