import { prisma } from "../database/prisma";

import { User } from "../generated/prisma/client";
import { UsersRepository } from "./users-repository";
import { UserCreateInput } from "../generated/prisma/models";

export class PrismaUserRepository implements UsersRepository {
  async create({ name, email, password }: UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });

    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });

    return user;
  }
}
