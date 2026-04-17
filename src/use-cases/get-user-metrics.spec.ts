import { beforeEach, describe, expect, it } from "vitest";

import { GetUserMetricsUseCase } from "./get-user-metrics";
import { CheckInsRepository } from "../repository/check-ins-repository";
import { InMemoryCheckInsRepository } from "../repository/in-memory/in-memory-check-ins-repository";

describe("Get User Metrics Use Case", () => {
  let checkInsRepository: CheckInsRepository;
  let sut: GetUserMetricsUseCase;

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("should be able to get user metrics", async () => {
    for (let i = 1; i <= 8; i++) {
      await checkInsRepository.create({
        userId: "user-01",
        gymId: `gym-${i}`,
      });
    }

    const { numberOfCheckIns } = await sut.execute({ userId: "user-01" });

    expect(numberOfCheckIns).toBe(8);
  });
});
