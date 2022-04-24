const InvariantError = require('../../../Commons/exceptions/InvariantError');
const DeleteComment = require('../../../Domains/threads/comment/entities/DeleteComment');
const CommentRepository = require('../../../Domains/threads/comment/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
    /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };

        /** creating dependency of use case */
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockCommentRepository.deleteCommentById = jest.fn(() =>
            Promise.resolve(),
        );
        mockCommentRepository.verifyCommentExist = jest.fn(() =>
            Promise.resolve(),
        );

        /** creating use case instance */
        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
        });

        // Action and Assert
        await expect(
            deleteCommentUseCase.execute(useCasePayload),
        ).resolves.not.toThrow(InvariantError);
        expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
            new DeleteComment({
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
            }),
        );
        expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(
            useCasePayload,
        );
    });
});
