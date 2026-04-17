import { ValidateCheckInUseCase } from "../use-cases/validate-check-in";
import { PrismaCheckInsRepository } from "../repository/prisma-check-ins-repository";

export function makeValidateCheckInUseCaseFactory() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const sut = new ValidateCheckInUseCase(checkInsRepository);

  return sut;
}
