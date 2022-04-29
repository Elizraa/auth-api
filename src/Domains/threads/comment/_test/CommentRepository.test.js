const CommentRepository = require('../CommentRepository');

describe('commentRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const commentRepository = new CommentRepository();

        await expect(commentRepository.verifyCommentExist()).rejects.toThrowError(
            'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );

        await expect(commentRepository.addComment({})).rejects.toThrowError(
            'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );

        await expect(commentRepository.getCommentsByThreadId({})).rejects.toThrowError(
            'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );

        await expect(commentRepository.deleteCommentById({})).rejects.toThrowError(
            'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );
    });
});
