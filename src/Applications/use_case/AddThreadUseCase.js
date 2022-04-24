const CreateThread = require('../../Domains/threads/thread/entities/CreateThread');

class AddThreadUseCase {
  constructor({
    threadRepository,
  }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCaseUserId, useCasePayload) {
    // await this._authenticationRepository.checkAvailabilityToken(accessToken);
    const newThread = new CreateThread(useCaseUserId, useCasePayload);
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
