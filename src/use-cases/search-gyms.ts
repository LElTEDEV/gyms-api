import { Gym } from "../generated/prisma/client";
import { GymsRepository } from "../repository/gyms-repository";

interface SearchGymsRequest {
  query: string;
  page: number;
}

interface SearchGymsResponse {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsRequest): Promise<SearchGymsResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return { gyms };
  }
}
