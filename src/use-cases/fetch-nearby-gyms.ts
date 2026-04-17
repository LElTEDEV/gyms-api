import { Gym } from "../generated/prisma/client";
import { GymsRepository } from "../repository/gyms-repository";

interface FetchNearbyGymsRequest {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyGymsResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsRequest): Promise<FetchNearbyGymsResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { gyms };
  }
}
