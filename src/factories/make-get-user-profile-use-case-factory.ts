import { GetUserProfileUseCase } from "../use-cases/get-user-profile";
import { PrismaUserRepository } from "../repository/prisma-users-repository";

export function makeGetUserProfileUseCaseFactory() {
  const usersRepository = new PrismaUserRepository();
  const sut = new GetUserProfileUseCase(usersRepository);

  return sut;
}
