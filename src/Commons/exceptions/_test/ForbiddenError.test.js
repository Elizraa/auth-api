const ForbiddenError = require('../ForbiddenError');

describe('ForbiddenError', () => {
    it('should create ForbiddenError correctly', () => {
        const forbiddenError = new ForbiddenError('Forbidden Error!');
        expect(forbiddenError.statusCode).toEqual(403);
        expect(forbiddenError.message).toEqual('Forbidden Error!');
        expect(forbiddenError.name).toEqual('ForbiddenError');
    });
});
