import { CreateGymUseCase } from "../use-cases/create-gym";
import { PrismaGymsRepository } from "../repository/prisma-gyms-repository";

export function makeCreateGymUseCaseFactory() {
  const gymsRepository = new PrismaGymsRepository();
  const sut = new CreateGymUseCase(gymsRepository);

  return sut;
}
