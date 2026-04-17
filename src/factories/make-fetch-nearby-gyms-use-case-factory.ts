import { FetchNearbyGymsUseCase } from "../use-cases/fetch-nearby-gyms";
import { PrismaGymsRepository } from "../repository/prisma-gyms-repository";

export function makeFetchNearbyGymsUseCaseFactory() {
  const gymsRepository = new PrismaGymsRepository();
  const sut = new FetchNearbyGymsUseCase(gymsRepository);

  return sut;
}
