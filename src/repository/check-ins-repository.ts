import { CheckIn } from "../generated/prisma/client";
import { CheckInUncheckedCreateInput } from "../generated/prisma/models";

export interface CheckInsRepository {
  create: (data: CheckInUncheckedCreateInput) => Promise<CheckIn>;
  findByUserIdOnDate: (userId: string, date: Date) => Promise<CheckIn | null>;
  findManyByUserId: (userId: string, page: number) => Promise<CheckIn[]>;
  countByUserId: (userId: string) => Promise<number>;
  findById: (id: string) => Promise<CheckIn | null>;
  save: (checkIn: CheckIn) => Promise<CheckIn>;
}
