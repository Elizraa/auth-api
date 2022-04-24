const NewThread = require('../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({
    threadRepository,
  }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCaseUserId, useCasePayload) {
    // this._validatePayload(useCasePayload);
    // await this._authenticationRepository.checkAvailabilityToken(accessToken);
    const newThread = new NewThread(useCaseUserId, useCasePayload);
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
