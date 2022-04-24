const NewThread = require('../NewThread');

describe('a NewThread entities', () => {

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const userIdPayload = 'user-123'
    const payload = {
      title: 'dicoding',
    };

    // Action and Assert
    expect(() => new NewThread(userIdPayload, payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const userIdPayload = 1.2
    const payload = {
      title: 123,
      body: true,
    };

    // Action and Assert
    expect(() => new NewThread(userIdPayload, payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });


  it('should create newThread object correctly', () => {
    // Arrange
    const userIdPayload = 'user-123'
    const payload = {
      title: 'dicoding',
      body: 'abc',
    };

    // Action
    const { userId, title, body } = new NewThread(userIdPayload, payload);

    // Assert
    expect(userId).toEqual(userIdPayload);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
