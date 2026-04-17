import { CheckInsRepository } from "../repository/check-ins-repository";

interface GetUserMetricsUseCaseRequest {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  numberOfCheckIns: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const numberOfCheckIns =
      await this.checkInsRepository.countByUserId(userId);

    return { numberOfCheckIns };
  }
}
