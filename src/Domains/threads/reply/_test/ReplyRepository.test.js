const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const replyRepository = new ReplyRepository();

        // Action and Assert
        await expect(replyRepository.verifyReplyExist({})).rejects.toThrowError(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );

        await expect(replyRepository.addReply({})).rejects.toThrowError(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );

        await expect(replyRepository.getRepliesByThreadId({})).rejects.toThrowError(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );

        await expect(replyRepository.deleteReplyById({})).rejects.toThrowError(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );
    });
});
