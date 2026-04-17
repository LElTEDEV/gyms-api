import { SearchGymsUseCase } from "../use-cases/search-gyms";
import { PrismaGymsRepository } from "../repository/prisma-gyms-repository";

export function makeSearchGymsUseCaseFactory() {
  const gymsRepository = new PrismaGymsRepository();
  const sut = new SearchGymsUseCase(gymsRepository);

  return sut;
}
