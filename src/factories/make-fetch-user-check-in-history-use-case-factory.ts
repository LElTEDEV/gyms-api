import { FetchUserCheckInsHistory } from "../use-cases/fetch-user-check-ins-history";
import { PrismaCheckInsRepository } from "../repository/prisma-check-ins-repository";

export function makeFetchUserCheckInHistoryUseCaseFactory() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const sut = new FetchUserCheckInsHistory(checkInsRepository);

  return sut;
}
