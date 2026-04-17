import { Gym } from "../generated/prisma/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CheckInUseCase } from "./check-in";
import { GymsRepository } from "../repository/gyms-repository";
import { CheckInsRepository } from "../repository/check-ins-repository";
import { InMemoryGymsRepository } from "../repository/in-memory/in-memory-gyms-repository";
import { InMemoryCheckInsRepository } from "../repository/in-memory/in-memory-check-ins-repository";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

describe("Check-ins Use Case", () => {
  let gym: Gym;
  let sut: CheckInUseCase;
  let gymsRepository: GymsRepository;
  let checkInsRepository: CheckInsRepository;

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gym = await gymsRepository.create({
      title: "GYM JS",
      latitude: -22.597145469137466,
      longitude: -46.52717033899185,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to create a check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: "user-01",
      userLatitude: -22.597145469137466,
      userLongitude: -46.52717033899185,
    });

    expect(checkIn.id).toEqual(expect.any(String));
    expect(checkIn.gymId).toEqual(gym.id);
    expect(checkIn.userId).toEqual("user-01");
  });

  it("should not be able to check in twice in the same day", async () => {
    await gymsRepository.create({
      id: "gym-02",
      title: "GYM TS",
      latitude: -22.597145469137466,
      longitude: -46.52717033899185,
    });

    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: gym.id,
      userId: "user-01",
      userLatitude: -22.597145469137466,
      userLongitude: -46.52717033899185,
    });

    await expect(
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -22.597145469137466,
        userLongitude: -46.52717033899185,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check-in in different days", async () => {
    vi.setSystemTime(new Date(2026, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: gym.id,
      userId: "user-01",
      userLatitude: -22.597145469137466,
      userLongitude: -46.52717033899185,
    });

    vi.setSystemTime(new Date(2026, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: gym.id,
      userId: "user-01",
      userLatitude: -22.597145469137466,
      userLongitude: -46.52717033899185,
    });

    expect(checkIn.id).toEqual(expect.any(String));
    expect(checkIn.userId).toEqual("user-01");
  });

  it("should not be able to check-in on distant gym", async () => {
    await expect(
      sut.execute({
        gymId: gym.id,
        userId: "user-01",
        userLatitude: -22.597939425170008,
        userLongitude: -46.53241616291928,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
