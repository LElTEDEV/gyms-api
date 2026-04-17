import { beforeEach, describe, expect, it } from "vitest";

import { GymsRepository } from "../repository/gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";
import { InMemoryGymsRepository } from "../repository/in-memory/in-memory-gyms-repository";

describe("Search Gyms Use Case", () => {
  let gymsRepository: GymsRepository;
  let sut: SearchGymsUseCase;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "GYM JS",
      latitude: -22.597071046663537,
      longitude: -46.527233986506445,
    });

    await gymsRepository.create({
      title: "ACADEMIA TS",
      latitude: -22.58660609746584,
      longitude: -46.527352770197545,
    });

    const { gyms } = await sut.execute({ query: "academia", page: 1 });

    expect(gyms).toHaveLength(1);
  });

  it("should be able to fetch paginated gyms search", async () => {
    for (let i = 0; i < 22; i++) {
      await gymsRepository.create({
        title: `GYM TS ${i}`,
        latitude: -22.58660609746584,
        longitude: -46.527352770197545,
      });
    }

    const { gyms } = await sut.execute({ query: "gym", page: 2 });

    expect(gyms).toHaveLength(2);
  });
});
