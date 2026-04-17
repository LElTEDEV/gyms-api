import { UsersRepository } from "../repository/users-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserForRefreshTokenUseCaseRequest {
  userId: string;
}

export class GetUserForRefreshTokenUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: GetUserForRefreshTokenUseCaseRequest) {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) throw new ResourceNotFoundError();

    return { user };
  }
}
