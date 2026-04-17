import { beforeEach, describe, expect, it } from "vitest";

import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";
import { GymsRepository } from "../repository/gyms-repository";
import { InMemoryGymsRepository } from "../repository/in-memory/in-memory-gyms-repository";

describe("Fetch Nearby Gyms Use Case", () => {
  let gymsRepository: GymsRepository;
  let sut: FetchNearbyGymsUseCase;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Academia JavaScript",
      latitude: -22.59714560845814,
      longitude: -46.52714892232576,
    });

    await gymsRepository.create({
      title: "Academia TypeScript",
      latitude: -22.590281150140182,
      longitude: -46.52818961944092,
    });

    await gymsRepository.create({
      title: "Academia São Paulo",
      latitude: -22.485299992359497,
      longitude: -48.94656525869593,
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.59725844885651,
      userLongitude: -46.532047904856405,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms[0].title).toEqual("Academia JavaScript");
  });
});
