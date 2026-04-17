import { randomUUID } from "node:crypto";
import { Decimal } from "@prisma/client/runtime/client";

import { Gym } from "../generated/prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { GymCreateInput } from "../generated/prisma/models";
import { getDistanceBetweenCoordinates } from "../../utils/get-distance-between-coordinates";

export class InMemoryGymsRepository implements GymsRepository {
  private gyms: Gym[] = [];

  async create(data: GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      createdAt: new Date(),
      phone: data.phone ?? null,
    };

    this.gyms.push(gym);

    return gym;
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((item) => item.id === id);

    return gym ?? null;
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.gyms
      .filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase().trim()),
      )
      .slice((page - 1) * 20, page * 20);
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Gym[]> {
    return this.gyms.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      );

      return distance < 10;
    });
  }
}
