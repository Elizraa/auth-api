const ThreadRepository = require("../../../Domains/threads/thread/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");
const CreateThread = require("../../../Domains/threads/thread/entities/CreateThread");
const CreatedThread = require("../../../Domains/threads/thread/entities/CreatedThread");

describe("AddThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCaseUserId = "user-123";
    const useCasePayload = {
      title: "dicoding",
      body: "abc",
    };

    const expectedCreatedThread = new CreatedThread({
      id: "thread-123",
      title: "dicoding",
      owner: "user-123",
    });

    const mockThreadRepository = new ThreadRepository();
    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedCreatedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Act
    const createdThread = await addThreadUseCase.execute(
      useCaseUserId,
      useCasePayload
    );

    // Assert
    expect(createdThread).toStrictEqual(expectedCreatedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new CreateThread("user-123", {
        title: "dicoding",
        body: "abc",
      })
    );
  });
});
