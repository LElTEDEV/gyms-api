import { CheckInUseCase } from "../use-cases/check-in";
import { PrismaGymsRepository } from "../repository/prisma-gyms-repository";
import { PrismaCheckInsRepository } from "../repository/prisma-check-ins-repository";

export function makeCheckInUseCaseFactory() {
  const gymsRepository = new PrismaGymsRepository();
  const checkInsRepository = new PrismaCheckInsRepository();
  const sut = new CheckInUseCase(checkInsRepository, gymsRepository);

  return sut;
}
