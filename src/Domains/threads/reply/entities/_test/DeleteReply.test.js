const DeleteReply = require('../DeleteReply');

describe('a DeleteReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            commentId: 123,
        };

        // Action and Assert
        expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            commentId: [],
            replyId: 123,
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new DeleteReply(payload)).toThrowError('DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create DeleteReply object correctly', () => {
        // Arrange
        const payload = {
            commentId: 'comment-123',
            replyId: 'reply-123',
            owner: 'user-123',
        };

        // Action
        const { commentId, replyId, owner } = new DeleteReply(payload);

        // Assert
        expect(commentId).toEqual(payload.commentId);
        expect(replyId).toEqual(payload.replyId);
        expect(owner).toEqual(payload.owner);
    });
});
