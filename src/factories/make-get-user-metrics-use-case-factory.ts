import { GetUserMetricsUseCase } from "../use-cases/get-user-metrics";
import { PrismaCheckInsRepository } from "../repository/prisma-check-ins-repository";

export function makeGetUserMetricsUseCaseFactory() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const sut = new GetUserMetricsUseCase(checkInsRepository);

  return sut;
}
