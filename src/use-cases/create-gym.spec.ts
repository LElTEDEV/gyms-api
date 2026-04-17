import { beforeEach, describe, expect, it } from "vitest";

import { GymsRepository } from "../repository/gyms-repository";
import { CreateGymUseCase } from "./create-gym";
import { InMemoryGymsRepository } from "../repository/in-memory/in-memory-gyms-repository";

describe("Create Gym Use Case", () => {
  let gymsRepository: GymsRepository;
  let sut: CreateGymUseCase;

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });

  it("should be able to create a new gym", async () => {
    const { gym } = await sut.execute({
      title: "GYM JS",
      description: "GYM PARA DEVS",
      latitude: -22.590785830958733,
      longitude: -46.52847677581293,
      phone: "(99) 99999-9999",
    });

    expect(gym.id).toEqual(expect.any(String));
    expect(gym.title).toBe("GYM JS");
  });
});
