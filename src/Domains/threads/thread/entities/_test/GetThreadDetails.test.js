const GetThreadDetails = require('../GetThreadDetails');

describe('a GetThreadDetails entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Action and Assert
        expect(() => new GetThreadDetails({})).toThrowError('GET_THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            threadId: 123,
        };

        // Action and Assert
        expect(() => new GetThreadDetails(payload)).toThrowError(
            'GET_THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION',
        );
    });

    it('should create GetThreadDetails object correctly', () => {
        // Arrange
        const payload = {
            threadId: 'thread-123',
        };

        // Action
        const { threadId } = new GetThreadDetails(payload);

        // Assert
        expect(threadId).toEqual(payload.threadId);
    });
});
