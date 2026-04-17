import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InMemoryCheckInsRepository } from "../repository/in-memory/in-memory-check-ins-repository";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

describe("Validate Check-In Use Case", () => {
  let checkInRepository: InMemoryCheckInsRepository;
  let sut: ValidateCheckInUseCase;

  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate a check-in", async () => {
    const checkInCreated = await checkInRepository.create({
      gymId: "gym-01",
      userId: "user-01",
    });

    const { checkIn } = await sut.execute({ checkInId: checkInCreated.id });

    expect(checkIn.validatedAt).toEqual(expect.any(Date));
    expect(checkInRepository.checkIns[0].validatedAt).toEqual(expect.any(Date));
  });

  it("should not be able to validate a wrong check-in id", async () => {
    await expect(
      sut.execute({ checkInId: "inexistent-check-in-id" }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const checkInCreated = await checkInRepository.create({
      gymId: "gym-01",
      userId: "user-01",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(
      sut.execute({ checkInId: checkInCreated.id }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
