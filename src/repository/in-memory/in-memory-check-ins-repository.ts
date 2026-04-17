import dayjs from "dayjs";
import { randomUUID } from "node:crypto";

import { CheckIn } from "../generated/prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { CheckInUncheckedCreateInput } from "../generated/prisma/models";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = [];

  async create(data: CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      userId: data.userId,
      gymId: data.gymId,
      createdAt: new Date(),
      validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
    } as CheckIn;

    this.checkIns.push(checkIn);

    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.checkIns.find((item) => {
      const checkInDate = dayjs(item.createdAt);

      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return item.userId === userId && isOnSameDate;
    });

    return checkInOnSameDate ?? null;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = this.checkIns
      .filter((item) => item.userId === userId)
      .slice((page - 1) * 20, page * 20);

    return checkIns;
  }

  async countByUserId(userId: string): Promise<number> {
    const numberOfCheckIns = this.checkIns.filter(
      (item) => item.userId === userId,
    ).length;

    return numberOfCheckIns;
  }

  async findById(id: string): Promise<CheckIn | null> {
    return this.checkIns.find((item) => item.id === id) ?? null;
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.checkIns.findIndex(
      (item) => item.id === checkIn.id,
    );

    if (checkInIndex >= 0) {
      this.checkIns[checkInIndex] = checkIn;
    }

    return checkIn;
  }
}
