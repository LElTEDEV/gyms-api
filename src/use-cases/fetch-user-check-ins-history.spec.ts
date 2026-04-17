import { beforeEach, describe, expect, it } from "vitest";

import { CheckInsRepository } from "../repository/check-ins-repository";
import { FetchUserCheckInsHistory } from "./fetch-user-check-ins-history";
import { InMemoryCheckInsRepository } from "../repository/in-memory/in-memory-check-ins-repository";

describe("Fetch User Check-In History Use Case", () => {
  let checkInsRepository: CheckInsRepository;
  let sut: FetchUserCheckInsHistory;

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistory(checkInsRepository);
  });

  it("should be able to fetch check-in history", async () => {
    for (let i = 0; i <= 22; i++) {
      await checkInsRepository.create({
        gymId: `gym-${i.toString().padStart(2, "0")}`,
        userId: "user-01",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(20);
    // expect(checkIns).toEqual([
    //   expect.objectContaining({ gym_id: "gym_01" }),
    //   expect.objectContaining({ gym_id: "gym_02" }),
    // ]);
  });

  it("should be able to fetch paginated check-ins history", async () => {
    for (let i = 0; i < 22; i++) {
      await checkInsRepository.create({
        gymId: `gym-${i.toString().padStart(2, "0")}`,
        userId: "user-01",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    // expect(checkIns).toEqual([
    //   expect.objectContaining({ gym_id: "gym_01" }),
    //   expect.objectContaining({ gym_id: "gym_02" }),
    // ]);
  });
});
