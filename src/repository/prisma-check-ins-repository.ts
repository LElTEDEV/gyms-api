import dayjs from "dayjs";

import { prisma } from "../database/prisma";
import { CheckIn } from "../generated/prisma/client";
import { CheckInsRepository } from "./check-ins-repository";
import { CheckInUncheckedCreateInput } from "../generated/prisma/models";

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data,
    });

    return checkIn;
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        userId: userId,
      },
      include: { gym: { select: { title: true } } },
      skip: (page - 1) * 20,
      take: 20,
    });

    return checkIns;
  }

  async countByUserId(userId: string): Promise<number> {
    const numberOfCheckIns = await prisma.checkIn.count({
      where: {
        userId: userId,
      },
    });

    return numberOfCheckIns;
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const checkInSaved = await prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: checkIn,
    });

    return checkInSaved;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    });

    return checkIn;
  }
}
