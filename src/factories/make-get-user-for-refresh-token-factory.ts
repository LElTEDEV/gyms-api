import { PrismaUserRepository } from "../repository/prisma-users-repository";
import { GetUserForRefreshTokenUseCase } from "../use-cases/get-user-for-refresh-token";

export function makeGetUserForRefreshTokenUseCase() {
  const usersRepository = new PrismaUserRepository();
  const sut = new GetUserForRefreshTokenUseCase(usersRepository);

  return sut;
}
