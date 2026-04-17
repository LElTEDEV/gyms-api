import { AuthenticateUseCase } from "../use-cases/authenticate";
import { PrismaUserRepository } from "../repository/prisma-users-repository";

export function makeAuthenticateUseCaseFactory() {
  const usersRepository = new PrismaUserRepository();
  const sut = new AuthenticateUseCase(usersRepository);

  return sut;
}
