import { RegisterUseCase } from "../use-cases/register";
import { PrismaUserRepository } from "../repository/prisma-users-repository";

export function makeRegisterUseCaseFactory() {
  const usersRepository = new PrismaUserRepository();
  const sut = new RegisterUseCase(usersRepository);

  return sut;
}
