const CreatedComment = require('../../../Domains/threads/comment/entities/CreatedComment');
const CreateComment = require('../../../Domains/threads/comment/entities/CreateComment');
const CommentRepository = require('../../../Domains/threads/comment/CommentRepository');
const CreateCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/thread/ThreadRepository');

describe('CreatCommentUseCase', () => {
    /**
     * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
     */
    it('should orchestrating the create comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            content: 'Tentang cerita dulu',
            owner: 'user-123',
        };

        const expectedCreatedThread = new CreatedComment({
            id: 'comment-123',
            content: 'Tentang cerita dulu',
            owner: 'user-123',
        });

        /** creating dependency of use case */
        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockCommentRepository.addComment = jest.fn(() =>
            Promise.resolve(expectedCreatedThread),
        );
        mockThreadRepository.verifyThreadExist = jest.fn(() =>
            Promise.resolve(),
        );

        /** creating use case instance */
        const createCommentUseCase = new CreateCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // Action
        const createdThread = await createCommentUseCase.execute(useCasePayload);

        // Assert
        expect(createdThread).toStrictEqual(expectedCreatedThread);
        expect(mockCommentRepository.addComment).toBeCalledWith(
            new CreateComment({
                threadId: 'thread-123',
                content: 'Tentang cerita dulu',
                owner: 'user-123',
            }),
        );
        expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(
            'thread-123',
        );
    });
});
